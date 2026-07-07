import { db } from "../db";
import * as schema from "../db/schema";
import { eq, desc, and } from "drizzle-orm";
import { HistoryEvent } from "../definitions/definitions";

export async function getActivityHistory(userId: string): Promise<HistoryEvent[]> {
  try {
    const [lessons, quizzes, achievements] = await Promise.all([
      // 1. Completed Lessons
      db
        .select({
          lesson_id: schema.user_lesson_progress.lesson_id,
          lessonTitle: schema.lessons.title,
          xpReward: schema.lessons.xp_reward,
          completed_at: schema.user_lesson_progress.completed_at,
          courseName: schema.courses.name,
        })
        .from(schema.user_lesson_progress)
        .innerJoin(schema.lessons, eq(schema.user_lesson_progress.lesson_id, schema.lessons.id))
        .innerJoin(schema.sections, eq(schema.lessons.section_id, schema.sections.id))
        .innerJoin(schema.courses, eq(schema.sections.course_id, schema.courses.id))
        .where(
          and(
            eq(schema.user_lesson_progress.user_id, userId),
            eq(schema.user_lesson_progress.status, 'completed')
          )
        ),

      // 2. Quiz Attempts
      db
        .select({
          id: schema.quiz_attempts.id,
          quizTitle: schema.quizzes.title,
          score: schema.quiz_attempts.score,
          total: schema.quiz_attempts.total,
          xpEarned: schema.quiz_attempts.xp_earned,
          completed_at: schema.quiz_attempts.completed_at,
          courseName: schema.courses.name,
        })
        .from(schema.quiz_attempts)
        .innerJoin(schema.quizzes, eq(schema.quiz_attempts.quiz_id, schema.quizzes.id))
        .innerJoin(schema.lessons, eq(schema.quizzes.lesson_id, schema.lessons.id))
        .innerJoin(schema.sections, eq(schema.lessons.section_id, schema.sections.id))
        .innerJoin(schema.courses, eq(schema.sections.course_id, schema.courses.id))
        .where(eq(schema.quiz_attempts.user_id, userId)),

      // 3. Unlocked Achievements
      db
        .select({
          achievement_id: schema.user_achievements.achievement_id,
          achievementTitle: schema.achievements.title,
          rewardXp: schema.achievements.reward_xp,
          unlocked_at: schema.user_achievements.unlocked_at,
        })
        .from(schema.user_achievements)
        .innerJoin(schema.achievements, eq(schema.user_achievements.achievement_id, schema.achievements.id))
        .where(eq(schema.user_achievements.user_id, userId)),
    ]);

    // Map to HistoryEvent format
    const lessonEvents: HistoryEvent[] = lessons.map((l) => ({
      id: `lesson-${l.lesson_id}`,
      type: 'lesson',
      title: `Completed Lesson: ${l.lessonTitle}`,
      course: l.courseName,
      xp: l.xpReward || 0,
      completedAt: l.completed_at || new Date(),
    }));

    const quizEvents: HistoryEvent[] = quizzes.map((q) => ({
      id: `quiz-${q.id}`,
      type: 'quiz',
      title: `Scored ${Math.round((q.score / q.total) * 100)}% on ${q.quizTitle}`,
      course: q.courseName,
      xp: q.xpEarned || 0,
      completedAt: q.completed_at || new Date(),
    }));

    const achievementEvents: HistoryEvent[] = achievements.map((a) => ({
      id: `achievement-${a.achievement_id}`,
      type: 'achievement',
      title: `Unlocked Achievement: ${a.achievementTitle}`,
      course: null,
      xp: a.rewardXp || 0,
      completedAt: a.unlocked_at || new Date(),
    }));

    // Combine and sort by date descending
    return [...lessonEvents, ...quizEvents, ...achievementEvents].sort(
      (a, b) => b.completedAt.getTime() - a.completedAt.getTime()
    );
  } catch (error) {
    console.error("Error fetching activity history:", error);
    return [];
  }
}
