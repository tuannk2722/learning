'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseLessonBlocks } from "@/app/lib/definitions/lessons";
import { DetailLesson } from "@/app/lib/definitions/lessons";
import { showQuestToasts } from "@/app/ui/quests/quest-toast";
import { showAchievementToasts } from "@/app/ui/achievement/achievement-toast";
import { useLessonHeartbeat } from "@/app/hooks/use-lesson-heartbeat";
import { toast } from "sonner";
import { SessionReplacedBanner } from "./lesson-content-components/session-replaced-banner";
import { LessonBlockRender } from "./lesson-content-components/lesson-block-render";
import { QuizAccessSection } from "./lesson-content-components/quiz-access-section";
import { XpCongratsOverlay } from "./lesson-content-components/xp-congrats-overlay";
import { LessonUnlockGuide } from "./lesson-content-components/lesson-unlock-guide";

interface LessonContentProps {
  lesson: DetailLesson;
  courseId: string;
  lessonId: string;
  isAlreadyCompleted?: boolean;
}

export function LessonContent({
  lesson,
  courseId,
  lessonId,
  isAlreadyCompleted = false,
}: LessonContentProps) {
  const router = useRouter();
  const {
    isSessionReplaced,
    isCompleted,
    completionResult,
  } = useLessonHeartbeat(lessonId, isAlreadyCompleted);

  // State for XP celebratory animation
  const [showXpCongrats, setShowXpCongrats] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);

  // Optimized completion flow: single timer, unified trigger, delay quests/achievements
  useEffect(() => {
    if (!completionResult || !completionResult.success) return;

    const { xpEarned, questUpdates, unlockedAchievements } = completionResult;

    toast.success("The next lesson has been unlocked! 🎉");

    if (xpEarned > 0) {
      setXpAmount(xpEarned);
      setShowXpCongrats(true);
      // Refresh server-rendered curriculum so the newly unlocked lesson is clickable
      router.refresh();

      // Hide animation after 3 seconds
      const congratsTimer = setTimeout(() => setShowXpCongrats(false), 3000);

      // Delay quests/achievements toast to prevent cluttering the congrats UI
      const toastTimer = setTimeout(() => {
        if (questUpdates?.length) {
          showQuestToasts(questUpdates);
        }
        if (unlockedAchievements?.length) {
          showAchievementToasts(unlockedAchievements);
        }
      }, 1800);

      return () => {
        clearTimeout(congratsTimer);
        clearTimeout(toastTimer);
      };
    } else {
      // If no XP, show quests/achievements updates immediately
      if (questUpdates?.length) {
        showQuestToasts(questUpdates);
      }
      if (unlockedAchievements?.length) {
        showAchievementToasts(unlockedAchievements);
      }
    }
  }, [completionResult]);

  const blocks = parseLessonBlocks(lesson.blocks);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Warning banner when tab is inactive due to multi-tab detection */}
      <SessionReplacedBanner isSessionReplaced={isSessionReplaced} />

      {/* Guide: explain how to unlock the next lesson */}
      {!isAlreadyCompleted && !isCompleted && (
        <LessonUnlockGuide durationMinutes={lesson.duration_minutes} />
      )}

      {/* Visual content blocks rendering: Text markdown, Videos, Images, Code Blocks */}
      <LessonBlockRender blocks={blocks} />

      {/* Section showing next actions (Quiz access) only visible after completion */}
      <QuizAccessSection
        isCompleted={isCompleted}
        isAlreadyCompleted={isAlreadyCompleted}
        courseId={courseId}
        lessonId={lessonId}
      />

      {/* Interactive celebratory congrats XP popup */}
      <XpCongratsOverlay
        show={showXpCongrats}
        xpAmount={xpAmount}
      />
    </div>
  );
}