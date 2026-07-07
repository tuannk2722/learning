"use server";

import { and, eq, asc, sql } from "drizzle-orm";
import { db } from "../db";
import { user_lesson_progress, lessons, sections, enrollments, users } from "../db/schema";
import { revalidatePath } from "next/cache";
import { updateQuestProgress } from "./quests";
import { QuestUpdateInfo } from "../definitions/quests";
import { updateStreak } from "./streak";
import { StreakResult, UnlockedAchievement } from "../definitions/definitions";
import { evaluateAchievements } from "./achievements";

export async function completeLesson(
  lessonId: string,
  userId: string
): Promise<{ success: boolean; xpEarned: number; questUpdates: QuestUpdateInfo[]; streakResult?: StreakResult; unlockedAchievements?: UnlockedAchievement[] }> {
  try {
    // 0. Check if it was already completed to prevent duplicate XP farming
    const existingProgress = await db.select()
      .from(user_lesson_progress)
      .where(
        and(
          eq(user_lesson_progress.user_id, userId),
          eq(user_lesson_progress.lesson_id, Number(lessonId))
        )
      )
      .limit(1);

    const wasCompleted = existingProgress.length > 0 && existingProgress[0].status === 'completed';
    const questUpdates: QuestUpdateInfo[] = [];
    let streakResult: StreakResult | undefined;

    // 1. Mark current lesson as completed
    await db.insert(user_lesson_progress)
      .values({
        lesson_id: Number(lessonId),
        user_id: userId,
        status: "completed",
        completed_at: new Date(),
      })
      .onConflictDoUpdate({
        target: [user_lesson_progress.user_id, user_lesson_progress.lesson_id],
        set: {
          status: "completed",
          completed_at: new Date(),
        }
      });

    // 1.5. Reward XP if it's the first time
    let xpEarned = 0;
    if (!wasCompleted) {
      const lessonInfo = await db.select({ xp: lessons.xp_reward, duration: lessons.duration_minutes })
        .from(lessons)
        .where(eq(lessons.id, Number(lessonId)))
        .limit(1);

      if (lessonInfo.length > 0 && lessonInfo[0].xp) {
        xpEarned = lessonInfo[0].xp;
        await db.execute(sql`UPDATE users SET total_xp = COALESCE(total_xp, 0) + ${xpEarned} WHERE id = ${userId}`);
      }

      // Cập nhật streak (chỉ tính 1 lần mỗi ngày)
      streakResult = await updateStreak(userId);

      // Cập nhật tiến độ quest: hoàn thành bài học + kiếm XP + thời gian học
      const res1 = await updateQuestProgress('COMPLETE_LESSONS', 1, userId);
      questUpdates.push(...res1.questUpdates);

      if (xpEarned > 0) {
        const res2 = await updateQuestProgress('EARN_XP', xpEarned, userId);
        questUpdates.push(...res2.questUpdates);
      }

      const duration = lessonInfo[0]?.duration || 0;
      if (duration > 0) {
        const res3 = await updateQuestProgress('STUDY_TIME', duration, userId);
        questUpdates.push(...res3.questUpdates);
      }
    }

    // 2. Find course info and all lessons
    const currentLessonData = await db
      .select({ courseId: sections.course_id })
      .from(lessons)
      .innerJoin(sections, eq(lessons.section_id, sections.id))
      .where(eq(lessons.id, Number(lessonId)))
      .limit(1);

    if (currentLessonData.length > 0 && currentLessonData[0].courseId) {
      const courseId = currentLessonData[0].courseId;

      const courseLessons = await db
        .select({ id: lessons.id })
        .from(lessons)
        .innerJoin(sections, eq(lessons.section_id, sections.id))
        .where(eq(sections.course_id, courseId))
        .orderBy(asc(sections.order_index), asc(lessons.order_index));

      const currentIndex = courseLessons.findIndex(l => l.id === Number(lessonId));

      // 3. Unlock next lesson
      if (currentIndex !== -1 && currentIndex < courseLessons.length - 1) {
        const nextLesson = courseLessons[currentIndex + 1];

        const existingNext = await db.select()
          .from(user_lesson_progress)
          .where(
            and(
              eq(user_lesson_progress.user_id, userId),
              eq(user_lesson_progress.lesson_id, nextLesson.id)
            )
          )
          .limit(1);

        if (!existingNext.length) {
          await db.insert(user_lesson_progress).values({
            user_id: userId,
            lesson_id: nextLesson.id,
            status: "unlocked"
          });
        } else if (existingNext[0].status === "locked" || existingNext[0].status === "LOCKED") {
          await db.update(user_lesson_progress)
            .set({ status: "unlocked" })
            .where(
              and(
                eq(user_lesson_progress.user_id, userId),
                eq(user_lesson_progress.lesson_id, nextLesson.id)
              )
            );
        }
      }

      // 4. Update Course Progress
      const completedLessons = await db
        .select({ id: lessons.id })
        .from(user_lesson_progress)
        .innerJoin(lessons, eq(user_lesson_progress.lesson_id, lessons.id))
        .innerJoin(sections, eq(lessons.section_id, sections.id))
        .where(
          and(
            eq(user_lesson_progress.user_id, userId),
            eq(sections.course_id, courseId),
            eq(user_lesson_progress.status, 'completed')
          )
        );

      const totalLessonsCount = courseLessons.length;
      const progressPercent = totalLessonsCount > 0 ? Math.round((completedLessons.length / totalLessonsCount) * 100) : 0;

      await db.update(enrollments)
        .set({
          progress_percent: progressPercent,
          status: progressPercent === 100 ? 'COMPLETED' : 'ACTIVE',
          last_accessed_at: new Date()
        })
        .where(
          and(
            eq(enrollments.user_id, userId),
            eq(enrollments.course_id, courseId)
          )
        );
    }

    revalidatePath("/dashboard/courses", "layout");

    // Evaluate achievements at the very end
    const { unlocked } = await evaluateAchievements(userId);

    return { success: true, xpEarned, questUpdates, streakResult, unlockedAchievements: unlocked };
  } catch (error) {
    console.error("Error completing lesson:", error);
    return { success: false, xpEarned: 0, questUpdates: [] };
  }
}
