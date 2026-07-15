import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/app/lib/db';
import { lesson_sessions, lessons } from '@/app/lib/db/schema';
import { eq, and } from 'drizzle-orm';

const MAX_DELTA_SECONDS = 20; // Cap delta để chống gian lận

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionToken, isActive } = await req.json();
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
        last_heartbeat_at: lesson_sessions.last_heartbeat_at,
        is_active: lesson_sessions.is_active,
      })
      .from(lesson_sessions)
      .where(eq(lesson_sessions.session_token, sessionToken))
      .limit(1);

    if (sessionData.length === 0) {
      return NextResponse.json(
        { status: 'error', error: 'Session not found' },
        { status: 404 }
      );
    }

    const lessonSession = sessionData[0];

    // Verify user ownership
    if (lessonSession.user_id !== userId) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Session đã bị replaced bởi tab khác
    if (!lessonSession.is_active) {
      return NextResponse.json({
        status: 'session_replaced' as const,
        accumulatedSeconds: lessonSession.accumulated_seconds ?? 0,
        requiredSeconds: 0,
        canComplete: false,
      });
    }

    const now = new Date();
    let newAccumulated = lessonSession.accumulated_seconds ?? 0;

    // Chỉ cộng thời gian khi client báo isActive = true
    if (isActive && lessonSession.last_heartbeat_at) {
      const deltaMs = now.getTime() - new Date(lessonSession.last_heartbeat_at).getTime();
      const deltaSeconds = Math.min(
        Math.max(0, Math.floor(deltaMs / 1000)),
        MAX_DELTA_SECONDS
      );
      newAccumulated += deltaSeconds;
    }

    // Cập nhật session
    await db
      .update(lesson_sessions)
      .set({
        accumulated_seconds: newAccumulated,
        last_heartbeat_at: now,
      })
      .where(eq(lesson_sessions.id, lessonSession.id));

    // Lấy required seconds từ lesson
    const lessonData = await db
      .select({ duration: lessons.duration_minutes })
      .from(lessons)
      .where(eq(lessons.id, lessonSession.lesson_id))
      .limit(1);

    const requiredSeconds = (lessonData[0]?.duration ?? 0) * 60;
    const canComplete = newAccumulated >= requiredSeconds;

    return NextResponse.json({
      status: 'ok' as const,
      accumulatedSeconds: newAccumulated,
      requiredSeconds,
      canComplete,
    });
  } catch (error) {
    console.error('Error processing heartbeat:', error);
    return NextResponse.json(
      { status: 'error', error: 'Internal server error' },
      { status: 500 }
    );
  }
}
