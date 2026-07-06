'use server';

import { db } from "../db";
import {
  achievements,
  user_achievements,
  users,
  user_lesson_progress,
  enrollments,
  quiz_attempts,
  lessons
} from "../db/schema";
import { eq, notInArray, and, sql } from "drizzle-orm";
import { calculateLevel } from "../utils/xp";
import { UnlockedAchievement } from "../definitions/definitions";
import { logActivity } from "./activity-log";

export async function evaluateAchievements(userId: string): Promise<{ unlocked: UnlockedAchievement[] }> {
  try {
    // 1. Get all unlocked achievement IDs for this user
    const unlockedRecords = await db
      .select({ achievement_id: user_achievements.achievement_id })
      .from(user_achievements)
      .where(eq(user_achievements.user_id, userId));

    const unlockedIds = unlockedRecords.map(r => r.achievement_id);

    // 2. Get all locked achievements
    const lockedQuery = db.select().from(achievements);
    const lockedAchievements = unlockedIds.length > 0
      ? await lockedQuery.where(notInArray(achievements.id, unlockedIds))
      : await lockedQuery;

    if (lockedAchievements.length === 0) {
      return { unlocked: [] };
    }

    // 3. Gather user stats needed for evaluation (do it once)
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const user = userResult[0];
    if (!user) return { unlocked: [] };

    // lesson count
    const lessonsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(user_lesson_progress)
      .where(and(eq(user_lesson_progress.user_id, userId), eq(user_lesson_progress.status, 'completed')));
    const completedLessons = Number(lessonsResult[0]?.count || 0);

    // course enrolled
    const coursesEnrolledResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .where(eq(enrollments.user_id, userId));
    const coursesEnrolled = Number(coursesEnrolledResult[0]?.count || 0);

    // course count
    const coursesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .where(and(eq(enrollments.user_id, userId), eq(enrollments.status, 'COMPLETED')));
    const completedCourses = Number(coursesResult[0]?.count || 0);

    // perfect quizzes
    const quizzesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(quiz_attempts)
      .where(and(eq(quiz_attempts.user_id, userId), sql`score = total`));
    const perfectQuizzes = Number(quizzesResult[0]?.count || 0);

    // level
    const currentLevel = calculateLevel(user.total_xp || 0).level;

    // rank (number of users with strictly more XP + 1)
    const rankResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`total_xp > ${user.total_xp || 0}`);
    const rank = Number(rankResult[0]?.count || 0) + 1;

    // hours
    const hoursResult = await db
      .select({ total_minutes: sql<number>`sum(${lessons.duration_minutes})` })
      .from(user_lesson_progress)
      .innerJoin(lessons, eq(user_lesson_progress.lesson_id, lessons.id))
      .where(and(eq(user_lesson_progress.user_id, userId), eq(user_lesson_progress.status, 'completed')));
    const studyHours = Number(hoursResult[0]?.total_minutes || 0) / 60;

    const newlyUnlocked: UnlockedAchievement[] = [];
    let hasNewUnlocks = false;

    // 4. Evaluate each locked achievement
    for (const ach of lockedAchievements) {
      const condition = ach.unlock_condition as any;
      if (!condition || typeof condition !== 'object') continue;

      let isMet = false;

      switch (condition.type) {
        case 'onboarding':
          isMet = user.is_onboarded === condition.value;
          break;
        case 'lesson_count':
          isMet = completedLessons >= condition.value;
          break;
        case 'course_enrollment':
          isMet = coursesEnrolled >= condition.value;
          break;
        case 'course_count':
          isMet = completedCourses >= condition.value;
          break;
        case 'level':
          isMet = currentLevel >= condition.value;
          break;
        case 'quiz_score':
          isMet = perfectQuizzes >= condition.value;
          break;
        case 'rank':
          isMet = rank <= condition.value; // e.g. Reach Top 1 means rank <= 1
          break;
        case 'streak':
          isMet = (user.current_streak || 0) >= condition.value || (user.longest_streak || 0) >= condition.value;
          break;
        case 'hours':
          isMet = studyHours >= condition.value;
          break;
        case 'all':
          // Check if user has unlocked all other achievements
          // unlockedIds.length + newlyUnlocked.length == total achievements - 1 (this one)
          const totalAchCount = await db.select({ count: sql<number>`count(*)` }).from(achievements);
          isMet = (unlockedIds.length + newlyUnlocked.length) >= (Number(totalAchCount[0]?.count || 0) - 1);
          break;
      }

      if (isMet) {
        await db.insert(user_achievements).values({
          user_id: userId,
          achievement_id: ach.id
        });

        // Cấp XP nếu có
        if (ach.reward_xp && ach.reward_xp > 0) {
          await db.execute(sql`UPDATE users SET total_xp = COALESCE(total_xp, 0) + ${ach.reward_xp} WHERE id = ${userId}`);
        }

        newlyUnlocked.push({
          id: ach.id,
          title: ach.title,
          description: ach.description,
          icon_name: ach.icon_name,
          theme_color: ach.theme_color,
          reward_xp: ach.reward_xp,
        });

        // Log achievement unlock
        void logActivity({
          userId,
          action: 'UNLOCK_ACHIEVEMENT',
          entityType: 'achievement',
          entityId: ach.id,
          entityName: ach.title,
          metadata: { reward_xp: ach.reward_xp, rarity: ach.rarity },
        });

        hasNewUnlocks = true;
      }
    }

    // Nếu có "Unlock all other achievements", kiểm tra đệ quy nhẹ 1 lần nữa để bắt kịp
    if (hasNewUnlocks && newlyUnlocked.length > 0) {
      const recursiveCheck = lockedAchievements.find(a => (a.unlock_condition as any)?.type === 'all');
      if (recursiveCheck && !newlyUnlocked.find(u => u.id === recursiveCheck.id)) {
        const totalAchCount = await db.select({ count: sql<number>`count(*)` }).from(achievements);
        const totalNow = unlockedIds.length + newlyUnlocked.length;
        if (totalNow >= (Number(totalAchCount[0]?.count || 0) - 1)) {
          await db.insert(user_achievements).values({ user_id: userId, achievement_id: recursiveCheck.id });
          newlyUnlocked.push({
            id: recursiveCheck.id,
            title: recursiveCheck.title,
            description: recursiveCheck.description,
            icon_name: recursiveCheck.icon_name,
            theme_color: recursiveCheck.theme_color,
            reward_xp: recursiveCheck.reward_xp,
          });
        }
      }
    }

    return { unlocked: newlyUnlocked };

  } catch (error) {
    console.error("Error evaluating achievements:", error);
    return { unlocked: [] };
  }
}
