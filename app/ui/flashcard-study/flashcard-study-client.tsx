'use client';

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type {
  FlashcardSetForStudy,
  FlashcardItemDTO,
  CardProgressMap,
  CardProgressStatus,
  CardProgressUpdate,
} from "@/app/lib/definitions/flashcards";
import { updateCardProgress, bulkUpdateCardProgress, resetSetProgress } from "@/app/lib/actions/flashcard";
import { StudySummary } from "./study-summary";
import { CardItem } from "./card-item";
import { ButtonControl } from "./button-control";
import { FlashcardNotFound } from "./not-found";

type AnswerStatus = "correct" | "incorrect" | null;

interface CardState {
  card: FlashcardItemDTO;
  status: AnswerStatus;
  seen: boolean;
}

interface Props {
  set: FlashcardSetForStudy;
  initialCardProgress?: CardProgressMap;
}

export default function FlashcardStudyClient({ set, initialCardProgress = {} }: Props) {
  const [cardStates, setCardStates] = useState<CardState[]>(() =>
    (set?.cards ?? []).map((card) => {
      const dbStatus = initialCardProgress[card.id];
      const status: AnswerStatus =
        dbStatus === "know" ? "correct" : dbStatus === "still_learning" ? "incorrect" : null;
      return {
        card,
        status,
        seen: status !== null,
      };
    })
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [trackProgress, setTrackProgress] = useState(true);
  const [isShuffled, setIsShuffled] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const [slideDirection, setSlideDirection] = useState(1);
  const [pendingResult, setPendingResult] = useState<AnswerStatus>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentCardState = cardStates[currentIndex];

  const finishSession = useCallback((updatedStates: CardState[]) => {
    setShowSummary(true);
    if (trackProgress) {
      // Khi học xong (kết thúc session), đồng bộ lại progress với DB nếu bật track progress
      const updates: CardProgressUpdate[] = updatedStates
        .filter((cs) => cs.status !== null)
        .map((cs) => ({
          cardId: cs.card.id,
          status: cs.status === "correct" ? "know" : "still_learning",
        }));
      void bulkUpdateCardProgress(set.id, updates);
    }
  }, [set.id, trackProgress]);

  const goNext = useCallback(() => {
    if (currentIndex < cardStates.length - 1) {
      setSlideDirection(1);
      setIsFlipped(false);
      setCurrentIndex((i) => i + 1);
    } else {
      finishSession(cardStates);
    }
  }, [currentIndex, cardStates, finishSession]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setSlideDirection(-1);
      setIsFlipped(false);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const markCard = useCallback(
    (status: AnswerStatus) => {
      if (isAnimating) return;

      if (trackProgress && status !== null) {
        setIsAnimating(true);
        setPendingResult(status);

        // Optimistic background save
        const cardId = currentCardState.card.id;
        const progressStatus: CardProgressStatus = status === "correct" ? "know" : "still_learning";
        void updateCardProgress(set.id, cardId, progressStatus);

        setTimeout(() => {
          const nextCardStates = cardStates.map((cs, i) =>
            i === currentIndex ? { ...cs, status, seen: true } : cs
          );
          setCardStates(nextCardStates);

          setSlideDirection(status === "correct" ? 1 : -1);
          setIsFlipped(false);
          setPendingResult(null);
          setIsAnimating(false);

          if (currentIndex < cardStates.length - 1) {
            setCurrentIndex((i) => i + 1);
          } else {
            finishSession(nextCardStates);
          }
        }, 450);
      } else {
        setCardStates((prev) =>
          prev.map((cs, i) => (i === currentIndex ? { ...cs, status: null, seen: true } : cs))
        );
        goNext();
      }
    },
    [isAnimating, trackProgress, currentCardState, set.id, cardStates, currentIndex, finishSession, goNext]
  );

  const handleUndo = () => {
    if (isAnimating || currentIndex === 0) return;
    const prevIndex = currentIndex - 1;
    const prevCard = cardStates[prevIndex].card;

    if (trackProgress) {
      // Reset trạng thái card trước đó về null trong UI và DB
      setCardStates((prev) =>
        prev.map((cs, i) => (i === prevIndex ? { ...cs, status: null, seen: false } : cs))
      );
      void updateCardProgress(set.id, prevCard.id, null);
    }
    goPrev();
  };

  /** Shuffle các cards tính từ card hiện tại trở về sau */
  const handleShuffle = () => {
    if (isAnimating) return;
    setCardStates((prev) => {
      const before = prev.slice(0, currentIndex);
      const remaining = prev.slice(currentIndex);

      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }

      return [...before, ...remaining];
    });
    setIsFlipped(false);
    setIsShuffled(true);
  };

  const handleRestart = () => {
    if (trackProgress) {
      void resetSetProgress(set.id);
    }
    setCardStates(
      (set?.cards ?? []).map((card) => ({
        card,
        status: null,
        seen: false,
      }))
    );
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowSummary(false);
    setPendingResult(null);
    setIsAnimating(false);
  };

  /** Lọc các cards còn "still learning" để học tiếp */
  const handleFocusStillLearning = () => {
    const stillLearningCards = cardStates.filter((cs) => cs.status === "incorrect");
    if (stillLearningCards.length === 0) return;

    setCardStates(
      stillLearningCards.map((cs) => ({
        ...cs,
        status: null,
        seen: false,
      }))
    );
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowSummary(false);
    setPendingResult(null);
    setIsAnimating(false);
  };

  // Reset card progress in UI when trackProgress is disabled
  useEffect(() => {
    if (!trackProgress) {
      setCardStates((prev) =>
        prev.map((cs) => ({ ...cs, status: null }))
      );
    }
  }, [trackProgress]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isAnimating || showSummary) return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.code === "ArrowRight") {
        markCard("correct");
      } else if (e.code === "ArrowLeft" && trackProgress) {
        markCard("incorrect");
      } else if (e.code === "ArrowLeft" && !trackProgress) {
        goPrev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [markCard, trackProgress, goPrev, isAnimating, showSummary]);

  const handleVolume = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const correct = cardStates.filter((c) => c.status === "correct").length;
  const incorrect = cardStates.filter((c) => c.status === "incorrect").length;

  if (!set) {
    return <FlashcardNotFound />;
  }

  if (showSummary) {
    return (
      <StudySummary
        trackProgress={trackProgress}
        set={set}
        correct={correct}
        incorrect={incorrect}
        total={cardStates.length}
        onRestart={handleRestart}
        onFocusStillLearning={handleFocusStillLearning}
      />
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-white flex flex-col overflow-hidden">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
          animate={{ width: `${((currentIndex + 1) / cardStates.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main flashcard area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-3 overflow-hidden">
        {trackProgress && (
          <div className="flex items-center justify-between w-full max-w-2xl mb-3 px-1">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-red-400 font-semibold">{incorrect} Still learning</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-emerald-500 font-semibold">Know {correct}</span>
            </div>
          </div>
        )}

        {/* Sliding card wrapper */}
        <div className="rounded-3xl w-full max-w-2xl overflow-visible">
          <AnimatePresence mode="wait" custom={slideDirection}>
            <CardItem
              key={currentIndex}
              card={currentCardState.card}
              isFlipped={isFlipped}
              isAnimating={isAnimating}
              pendingResult={pendingResult}
              slideDirection={slideDirection}
              onClick={() => {
                if (!isAnimating) setIsFlipped((f) => !f);
              }}
              onVolumeClick={handleVolume}
            />
          </AnimatePresence>
        </div>

        {/* Keyboard hint bar */}
        <div className="mt-2 bg-violet-50 rounded-xl px-4 py-2 flex items-center justify-center gap-2 text-xs text-violet-600">
          <span>⌨️</span>
          <kbd className="px-2 py-0.5 bg-white border border-violet-200 rounded-lg font-mono text-[10px] shadow-sm">Space</kbd>
          <span>to flip •</span>
          <kbd className="px-2 py-0.5 bg-white border border-violet-200 rounded-lg font-mono text-[10px] shadow-sm">←</kbd>
          <kbd className="px-2 py-0.5 bg-white border border-violet-200 rounded-lg font-mono text-[10px] shadow-sm">→</kbd>
          <span>to navigate</span>
        </div>
      </div>

      {/* Bottom control bar */}
      <ButtonControl
        trackProgress={trackProgress}
        setTrackProgress={setTrackProgress}
        currentIndex={currentIndex}
        totalCards={cardStates.length}
        isAnimating={isAnimating}
        isShuffled={isShuffled}
        onPrev={trackProgress ? () => markCard("incorrect") : goPrev}
        onNextCorrect={() => markCard("correct")}
        onUndo={handleUndo}
        onShuffle={handleShuffle}
      />
    </div>
  );
}
