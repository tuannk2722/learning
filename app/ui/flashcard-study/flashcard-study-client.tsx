'use client';

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RotateCcw, Shuffle,
  Volume2, ChevronLeft, ChevronRight,
  CornerUpLeft
} from "lucide-react";
import Link from "next/link";
import type { FlashcardItem, FlashcardSet } from "@/app/dashboard/flashcards/(overview)/page";
import { StudySummary } from "./study-summary";

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

  const markCard = (status: AnswerStatus) => {
    setCardStates((prev) =>
      prev.map((cs, i) => (i === currentIndex ? { ...cs, status, seen: true } : cs))
    );
    goNext();
  };

  const handleUndo = () => {
    setCardStates(prev => {
      return prev.map((cs, i) => (i === currentIndex - 1 ? { ...cs, status: null, seen: false } : cs))
    })
    goPrev();
  }

  const handleShuffle = () => {
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
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
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
  }, [markCard]);

  const handleVolume = (e: React.MouseEvent) => {
    e.stopPropagation();
  }

  const correct = cardStates.filter((c) => c.status === "correct").length;
  const incorrect = cardStates.filter((c) => c.status === "incorrect").length;

  if (!set) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Flashcard set not found.</p>
          <Link href="/dashboard/flashcards" className="text-violet-600 hover:underline">
            ← Go Back
          </Link>
        </div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <StudySummary
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

        {/* Sliding card wrapper — key changes only on index change, not on flip */}
        <div className="w-full max-w-2xl overflow-hidden">
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: slideDirection * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -slideDirection * 60 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              style={{ perspective: 1200 }}
              className="w-full cursor-pointer select-none"
              onClick={() => setIsFlipped((f) => !f)}
            >
              {/* Flip inner — rotates on click */}
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformStyle: "preserve-3d", position: "relative", minHeight: 320 }}
              >
                {/* ── Front face ── */}
                <div
                  className="absolute inset-0 bg-white rounded-3xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col justify-between"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Term</span>
                    <div className="w-full max-w-2xl flex items-center justify-end mb-2 px-5">
                      <button
                        className="text-gray-500 hover:text-blue-400 transition-colors"
                        onClick={handleVolume}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow flex flex-col items-center justify-center py-4">
                    <div className={`font-bold text-gray-900 leading-snug text-center ${currentCardState.card.front.length <= 4 ? "text-6xl"
                      : currentCardState.card.front.length <= 10 ? "text-4xl"
                        : "text-2xl"
                      }`}>
                      {currentCardState.card.front}
                    </div>
                  </div>
                </div>

                {/* ── Back face ── */}
                <div
                  className="absolute inset-0 bg-white rounded-3xl border-2 border-violet-100 shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col justify-between"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-violet-300 uppercase tracking-wider">Definition</span>
                    <div className="w-full max-w-2xl flex items-center justify-end mb-2 px-5">
                      <button
                        className="text-gray-500 hover:text-blue-400 transition-colors"
                        onClick={handleVolume}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow flex items-center justify-center py-4">
                    <div className="font-bold text-gray-900 leading-snug text-center text-xl">
                      {currentCardState.card.back}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
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
      <div className="border-t border-gray-100 bg-white px-5 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">

          {/* Track progress toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-violet-600 hidden lg:block">Track progress</span>
            <button
              onClick={() => setTrackProgress((t) => !t)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${trackProgress ? "bg-violet-600" : "bg-gray-200"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${trackProgress ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          {/* Center nav controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={trackProgress ? () => markCard("incorrect") : goPrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="min-w-[3.5rem] text-center">
              <span className="text-sm font-semibold text-gray-700">
                {currentIndex + 1} / {cardStates.length}
              </span>
            </div>

            <button
              onClick={() => markCard("correct")}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={currentIndex === 0}
              className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo"
            >
              <CornerUpLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleShuffle}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isShuffled
                ? "bg-violet-100 text-violet-600 border-2 border-violet-300"
                : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
