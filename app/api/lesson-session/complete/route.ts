import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/app/lib/db';
import { lesson_sessions, lessons } from '@/app/lib/db/schema';
import { eq } from 'drizzle-orm';
import { completeLesson } from '@/app/lib/actions/lesson';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionToken } = await req.json();
    if (!sessionToken) {
      return NextResponse.json({ error: 'sessionToken is required' }, { status: 400 });
    }

    // Tìm session
    const sessionData = await db
      .select({
        id: lesson_sessions.id,
        user_id: lesson_sessions.user_id,
        lesson_id: lesson_sessions.lesson_id,
        accumulated_seconds: lesson_sessions.accumulated_seconds,
        is_active: lesson_sessions.is_active,
      })
      .from(lesson_sessions)
      .where(eq(lesson_sessions.session_token, sessionToken))
      .limit(1);

    if (sessionData.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const lessonSession = sessionData[0];

    // Verify user ownership
    if (lessonSession.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Session phải còn active
    if (!lessonSession.is_active) {
      return NextResponse.json({ error: 'Session is no longer active' }, { status: 400 });
    }

    // Kiểm tra đủ thời gian
    const lessonData = await db
      .select({ duration: lessons.duration_minutes })
      .from(lessons)
      .where(eq(lessons.id, lessonSession.lesson_id))
      .limit(1);

    const requiredSeconds = (lessonData[0]?.duration ?? 0) * 60;
    const accumulated = lessonSession.accumulated_seconds ?? 0;

    if (accumulated < requiredSeconds) {
      return NextResponse.json({
        error: 'Not enough study time',
        accumulatedSeconds: accumulated,
        requiredSeconds,
      }, { status: 400 });
    }

    // Tính thời gian thực tế (phút) để dùng cho STUDY_TIME quest
    const actualStudyMinutes = Math.round(accumulated / 60);

    // Gọi completeLesson với thời gian thực tế
    const result = await completeLesson(
      String(lessonSession.lesson_id),
      userId,
      actualStudyMinutes
    );

    // Đánh dấu session inactive
    await db
      .update(lesson_sessions)
      .set({ is_active: false })
      .where(eq(lesson_sessions.id, lessonSession.id));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error completing lesson session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
