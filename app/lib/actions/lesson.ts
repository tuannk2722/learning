"use server";

import { and, eq, asc, sql } from "drizzle-orm";
import { db } from "../db";
import { user_lesson_progress, lessons, sections, enrollments, users } from "../db/schema";
import { revalidatePath } from "next/cache";
import { LessonBlock } from "../definitions/lessons";
import { updateQuestProgress } from "./quests";
import { QuestUpdateInfo } from "../definitions/quests";
import { updateStreak } from "./streak";
import { StreakResult, UnlockedAchievement } from "../definitions/definitions";
import { evaluateAchievements } from "./achievements";
import { auth } from "@/auth";
import { logActivity } from "./activity-log";

export async function completeLesson(
  lessonId: string,
  userId: string
): Promise<{ success: boolean; xpEarned: number; questUpdates: QuestUpdateInfo[]; streakResult?: StreakResult; unlockedAchievements?: UnlockedAchievement[] }> {
  try {
    const [, lessonInfoResult, courseData] = await Promise.all([
      // Mark current lesson as completed (upsert)
      db.insert(user_lesson_progress)
        .values({
          lesson_id: Number(lessonId),
          user_id: userId,
          status: "completed",
          completed_at: new Date(),
        })
        .onConflictDoUpdate({
          target: [user_lesson_progress.user_id, user_lesson_progress.lesson_id],
          set: { status: "completed", completed_at: new Date() },
        }),

      // Lấy XP reward + duration của lesson
      db.select({ xp: lessons.xp_reward, duration: lessons.duration_minutes })
        .from(lessons)
        .where(eq(lessons.id, Number(lessonId)))
        .limit(1),

      // Lấy courseId của lesson hiện tại
      db.select({ courseId: sections.course_id })
        .from(lessons)
        .innerJoin(sections, eq(lessons.section_id, sections.id))
        .where(eq(lessons.id, Number(lessonId)))
        .limit(1),
    ]);

    const xpEarned = lessonInfoResult[0]?.xp ?? 0;
    const duration = lessonInfoResult[0]?.duration ?? 0;

    const [streakResult, , questXp, questStudy] = await Promise.all([
      updateStreak(userId),

      xpEarned > 0
        ? db.execute(sql`UPDATE users SET total_xp = COALESCE(total_xp, 0) + ${xpEarned} WHERE id = ${userId}`)
        : Promise.resolve(null),

      xpEarned > 0
        ? updateQuestProgress("EARN_XP", xpEarned, userId)
        : Promise.resolve({ questUpdates: [] as QuestUpdateInfo[] }),

      duration > 0
        ? updateQuestProgress("STUDY_TIME", duration, userId)
        : Promise.resolve({ questUpdates: [] as QuestUpdateInfo[] }),
    ]);

    // Quest COMPLETE_LESSONS chạy riêng (tránh conflict nếu updateQuestProgress không idempotent)
    const res1 = await updateQuestProgress("COMPLETE_LESSONS", 1, userId);
    const questUpdates = [...questXp.questUpdates, ...questStudy.questUpdates, ...res1.questUpdates];

    // ── Xử lý course logic ──
    if (courseData.length > 0 && courseData[0].courseId) {
      const courseId = courseData[0].courseId;

      // Lấy tất cả published lessons trong course (cần để xác định nextLesson + totalCount)
      const courseLessons = await db
        .select({ id: lessons.id })
        .from(lessons)
        .innerJoin(sections, eq(lessons.section_id, sections.id))
        .where(and(
          eq(sections.course_id, courseId),
          eq(lessons.status, "published"),
        ))
        .orderBy(asc(sections.order_index), asc(lessons.order_index));

      const currentIndex = courseLessons.findIndex((l) => l.id === Number(lessonId));
      const nextLesson =
        currentIndex !== -1 && currentIndex < courseLessons.length - 1
          ? courseLessons[currentIndex + 1]
          : null;

      // ── unlock next lesson + đếm completedCount ──
      const [completedCountResult] = await Promise.all([
        db.select({ cnt: sql<number>`cast(count(*) as int)` })
          .from(user_lesson_progress)
          .innerJoin(lessons, eq(user_lesson_progress.lesson_id, lessons.id))
          .innerJoin(sections, eq(lessons.section_id, sections.id))
          .where(
            and(
              eq(user_lesson_progress.user_id, userId),
              eq(sections.course_id, courseId),
              eq(lessons.status, "published"),
              eq(user_lesson_progress.status, "completed"),
            )
          ),

        // Unlock next lesson: chỉ insert nếu chưa có record (onConflictDoNothing)
        // Nếu đã có record (dù locked/unlocked/completed) thì giữ nguyên
        nextLesson
          ? db.insert(user_lesson_progress)
            .values({ user_id: userId, lesson_id: nextLesson.id, status: "unlocked" })
            .onConflictDoNothing()
          : Promise.resolve(null),
      ]);

      const totalCount = courseLessons.length;
      const completedCount = completedCountResult[0]?.cnt ?? 0;
      const isFullyCompleted = totalCount > 0 && completedCount >= totalCount;

      // Cập nhật enrollment status ──
      await db.update(enrollments)
        .set({
          status: isFullyCompleted ? "COMPLETED" : "ACTIVE",
          last_accessed_at: new Date(),
        })
        .where(and(
          eq(enrollments.user_id, userId),
          eq(enrollments.course_id, courseId),
        ));
    }

    revalidatePath("/dashboard/courses", "layout");
    const { unlocked } = await evaluateAchievements(userId);

    // Log lesson completion
    const lessonInfo = await db.select({ title: lessons.title }).from(lessons).where(eq(lessons.id, Number(lessonId))).limit(1);
    void logActivity({
      userId,
      action: 'COMPLETE_LESSON',
      entityType: 'lesson',
      entityId: Number(lessonId),
      entityName: lessonInfo[0]?.title ?? undefined,
      metadata: { xpEarned },
    });

    return { success: true, xpEarned, questUpdates, streakResult, unlockedAchievements: unlocked };
  } catch (error) {
    console.error("Error completing lesson:", error);
    return { success: false, xpEarned: 0, questUpdates: [] };
  }
}

export async function saveLessonBlocks(
  lessonId: number,
  data: {
    title: string;
    duration_minutes: number;
    xp_reward: number;
    blocks: LessonBlock[];
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.update(lessons)
      .set({
        title: data.title,
        duration_minutes: data.duration_minutes,
        xp_reward: data.xp_reward,
        blocks: data.blocks,
        updated_at: new Date(),
      })
      .where(eq(lessons.id, lessonId));

    revalidatePath(`/admin/courses`, "layout");
    revalidatePath(`/dashboard/courses`, "layout");

    return { success: true };
  } catch (error) {
    console.error("Error saving lesson blocks:", error);
    return { success: false, error: (error as Error).message };
  }
}


export async function publishLesson(lessonId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    await db
      .update(lessons)
      .set({ status: 'published', updated_at: new Date() })
      .where(eq(lessons.id, lessonId));

    const lessonInfo = await db.select({ title: lessons.title }).from(lessons).where(eq(lessons.id, lessonId)).limit(1);
    void logActivity({
      userId: session.user.id,
      action: 'PUBLISH_LESSON',
      entityType: 'lesson',
      entityId: lessonId,
      entityName: lessonInfo[0]?.title ?? undefined,
    });

    // Revalidate để người học thấy lesson mới ngay
    revalidatePath('/dashboard/courses', 'layout');
    revalidatePath('/admin/courses', 'layout');

    return { success: true };
  } catch (error) {
    console.error('Error publishing lesson:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function unpublishLesson(lessonId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    await db
      .update(lessons)
      .set({ status: 'draft', updated_at: new Date() })
      .where(eq(lessons.id, lessonId));

    const lessonInfo2 = await db.select({ title: lessons.title }).from(lessons).where(eq(lessons.id, lessonId)).limit(1);
    void logActivity({
      userId: session.user.id,
      action: 'UNPUBLISH_LESSON',
      entityType: 'lesson',
      entityId: lessonId,
      entityName: lessonInfo2[0]?.title ?? undefined,
    });

    revalidatePath('/dashboard/courses', 'layout');
    revalidatePath('/admin/courses', 'layout');

    return { success: true };
  } catch (error) {
    console.error('Error unpublishing lesson:', error);
    return { success: false, error: (error as Error).message };
  }
}
