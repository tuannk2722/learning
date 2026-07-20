'use client';

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { FlashcardItem, FlashcardSet } from "@/app/dashboard/flashcards/(overview)/page";
import { StudySummary } from "./study-summary";
import { CardItem } from "./card-item";
import { ButtonControl } from "./button-control";
import { FlashcardNotFound } from "./not-found";

type AnswerStatus = "correct" | "incorrect" | null;

interface CardState {
  card: FlashcardItem;
  status: AnswerStatus;
  seen: boolean;
}

interface Props {
  set: FlashcardSet;
}

export default function FlashcardStudyClient({ set }: Props) {
  const [cardStates, setCardStates] = useState<CardState[]>(() =>
    (set?.cards ?? []).map((card) => ({ card, status: null, seen: false }))
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

  const goNext = useCallback(() => {
    if (currentIndex < cardStates.length - 1) {
      setSlideDirection(1);
      setIsFlipped(false);
      setCurrentIndex((i) => i + 1);
    } else {
      setShowSummary(true);
    }
  }, [currentIndex, cardStates.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setSlideDirection(-1);
      setIsFlipped(false);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const markCard = useCallback((status: AnswerStatus) => {
    if (isAnimating) return;

    if (trackProgress && status !== null) {
      setIsAnimating(true);
      setPendingResult(status);

      setTimeout(() => {
        setCardStates((prev) =>
          prev.map((cs, i) => (i === currentIndex ? { ...cs, status, seen: true } : cs))
        );

        setSlideDirection(status === "correct" ? 1 : -1);
        setIsFlipped(false);
        setPendingResult(null);
        setIsAnimating(false);

        if (currentIndex < cardStates.length - 1) {
          setCurrentIndex((i) => i + 1);
        } else {
          setShowSummary(true);
        }
      }, 450);
    } else {
      setCardStates((prev) =>
        prev.map((cs, i) => (i === currentIndex ? { ...cs, status, seen: true } : cs))
      );
      goNext();
    }
  }, [currentIndex, cardStates.length, trackProgress, goNext, isAnimating]);

  const handleUndo = () => {
    if (isAnimating) return;
    setCardStates(prev => {
      return prev.map((cs, i) => (i === currentIndex - 1 ? { ...cs, status: null, seen: false } : cs))
    })
    goPrev();
  }

  const handleShuffle = () => {
    if (isAnimating) return;
    setCardStates((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsShuffled((s) => !s);
  };

  const handleRestart = () => {
    setCardStates((set?.cards ?? []).map((card) => ({ card, status: null, seen: false })));
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowSummary(false);
    setPendingResult(null);
    setIsAnimating(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isAnimating) return;
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
  }, [markCard, trackProgress, goPrev, isAnimating]);

  const handleVolume = (e: React.MouseEvent) => {
    e.stopPropagation();
  }

  const correct = cardStates.filter((c) => c.status === "correct").length;
  const incorrect = cardStates.filter((c) => c.status === "incorrect").length;

  if (!set) {
    return (
      <FlashcardNotFound />
    );
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
              onClick={() => { if (!isAnimating) setIsFlipped((f) => !f); }}
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
