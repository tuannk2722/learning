import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/app/lib/db';
import { lesson_sessions, lessons, user_lesson_progress } from '@/app/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await req.json();
    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
    }

    const lessonIdNum = Number(lessonId);

    // Kiểm tra lesson tồn tại & lấy duration
    const lessonData = await db
      .select({ id: lessons.id, duration: lessons.duration_minutes })
      .from(lessons)
      .where(eq(lessons.id, lessonIdNum))
      .limit(1);

    if (lessonData.length === 0) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const requiredSeconds = (lessonData[0].duration ?? 0) * 60;

    // Kiểm tra lesson đã completed chưa
    const progressData = await db
      .select({ status: user_lesson_progress.status })
      .from(user_lesson_progress)
      .where(
        and(
          eq(user_lesson_progress.user_id, userId),
          eq(user_lesson_progress.lesson_id, lessonIdNum)
        )
      )
      .limit(1);

    if (progressData.length > 0 && progressData[0].status === 'completed') {
      return NextResponse.json({
        sessionToken: null,
        accumulatedSeconds: requiredSeconds,
        requiredSeconds,
        alreadyCompleted: true,
      });
    }

    // Lấy accumulated_seconds từ session cũ nhất (resume) trước khi deactivate
    const existingSessions = await db
      .select({ accumulated_seconds: lesson_sessions.accumulated_seconds })
      .from(lesson_sessions)
      .where(
        and(
          eq(lesson_sessions.user_id, userId),
          eq(lesson_sessions.lesson_id, lessonIdNum),
          eq(lesson_sessions.is_active, true)
        )
      );

    // Tổng thời gian từ tất cả sessions active (thường chỉ 1)
    const previousAccumulated = existingSessions.reduce(
      (sum, s) => sum + (s.accumulated_seconds ?? 0),
      0
    );

    // Vô hiệu hóa tất cả session cũ của user + lesson
    await db
      .update(lesson_sessions)
      .set({ is_active: false })
      .where(
        and(
          eq(lesson_sessions.user_id, userId),
          eq(lesson_sessions.lesson_id, lessonIdNum),
          eq(lesson_sessions.is_active, true)
        )
      );

    // Tạo session mới
    const sessionToken = randomUUID().replace(/-/g, '');
    await db.insert(lesson_sessions).values({
      user_id: userId,
      lesson_id: lessonIdNum,
      session_token: sessionToken,
      accumulated_seconds: previousAccumulated,
      last_heartbeat_at: new Date(),
      is_active: true,
    });

    return NextResponse.json({
      sessionToken,
      accumulatedSeconds: previousAccumulated,
      requiredSeconds,
      alreadyCompleted: false,
    });
  } catch (error) {
    console.error('Error starting lesson session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
