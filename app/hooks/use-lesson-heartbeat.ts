'use client';

import { useState, useEffect, useRef } from 'react';
import type { CompleteSessionResponse } from '@/app/lib/definitions/definitions';

const HEARTBEAT_INTERVAL_MS = 10_000; // 10 giây

export function useLessonHeartbeat(
  lessonId: string,
  isAlreadyCompleted: boolean
) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [canComplete, setCanComplete] = useState(false);
  const [isSessionReplaced, setIsSessionReplaced] = useState(false);
  const [isCompleted, setIsCompleted] = useState(isAlreadyCompleted);

  // Ref để track visibility state (tránh stale closure trong interval)
  const isActiveRef = useRef(true);
  const sessionTokenRef = useRef<string | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAutoCompletedRef = useRef(false);

  // Sync sessionToken ref
  useEffect(() => {
    sessionTokenRef.current = sessionToken;
  }, [sessionToken]);

  // ────────────────────────────────────────────
  // 1. START SESSION on mount
  // ────────────────────────────────────────────
  useEffect(() => {
    if (isAlreadyCompleted) return;

    const startSession = async () => {
      try {
        const res = await fetch('/api/lesson-session/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId }),
        });

        if (!res.ok) return;

        const data = await res.json();

        if (data.alreadyCompleted) {
          setIsCompleted(true);
          setCanComplete(true);
          return;
        }

        setSessionToken(data.sessionToken);

        // Kiểm tra nếu đã đủ thời gian từ session cũ (resume)
        if ((data.accumulatedSeconds ?? 0) >= (data.requiredSeconds ?? 0) && data.requiredSeconds > 0) {
          setCanComplete(true);
        }
      } catch (error) {
        console.error('Failed to start lesson session:', error);
      }
    };

    startSession();
  }, [lessonId, isAlreadyCompleted]);

  // ────────────────────────────────────────────
  // 2. PAGE VISIBILITY API tracking
  // ────────────────────────────────────────────
  useEffect(() => {
    if (isAlreadyCompleted) return;

    const handleVisibilityChange = () => {
      isActiveRef.current = document.visibilityState === 'visible' && document.hasFocus();
    };

    const handleFocus = () => {
      isActiveRef.current = document.visibilityState === 'visible';
    };

    const handleBlur = () => {
      isActiveRef.current = false;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isAlreadyCompleted]);

  // ────────────────────────────────────────────
  // 3. HEARTBEAT interval (mỗi 10s)
  // ────────────────────────────────────────────
  useEffect(() => {
    if (isAlreadyCompleted || !sessionToken || isSessionReplaced || isCompleted) return;

    const sendHeartbeat = async () => {
      const token = sessionTokenRef.current;
      if (!token) return;

      try {
        const res = await fetch('/api/lesson-session/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionToken: token,
            isActive: isActiveRef.current,
          }),
        });

        if (!res.ok) return;

        const data = await res.json();

        if (data.status === 'session_replaced') {
          setIsSessionReplaced(true);
          // Dừng heartbeat
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
          }
          return;
        }

        if (data.status === 'ok') {
          setCanComplete(data.canComplete);
        }
      } catch (error) {
        console.error('Heartbeat error:', error);
      }
    };

    // Gửi heartbeat đầu tiên ngay lập tức
    sendHeartbeat();

    heartbeatIntervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, [sessionToken, isAlreadyCompleted, isSessionReplaced, isCompleted]);

  // ────────────────────────────────────────────
  // 4. AUTO-COMPLETE khi đạt ngưỡng
  // ────────────────────────────────────────────
  const [completionResult, setCompletionResult] = useState<CompleteSessionResponse | null>(null);
  const [isAutoCompleting, setIsAutoCompleting] = useState(false);

  useEffect(() => {
    if (!canComplete || isCompleted || isAlreadyCompleted || hasAutoCompletedRef.current || isAutoCompleting) return;
    if (!sessionTokenRef.current) return;

    hasAutoCompletedRef.current = true;
    setIsAutoCompleting(true);

    const autoComplete = async () => {
      try {
        const res = await fetch('/api/lesson-session/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken: sessionTokenRef.current }),
        });

        if (!res.ok) {
          hasAutoCompletedRef.current = false;
          setIsAutoCompleting(false);
          return;
        }

        const data: CompleteSessionResponse = await res.json();

        if (data.success) {
          setIsCompleted(true);
          setCompletionResult(data);
          // Dừng heartbeat
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
          }
        } else {
          hasAutoCompletedRef.current = false;
        }
      } catch (error) {
        console.error('Auto-complete error:', error);
        hasAutoCompletedRef.current = false;
      } finally {
        setIsAutoCompleting(false);
      }
    };

    autoComplete();
  }, [canComplete, isCompleted, isAlreadyCompleted, isAutoCompleting]);

  return {
    isSessionReplaced,
    isCompleted,
    completionResult,
  };
}
