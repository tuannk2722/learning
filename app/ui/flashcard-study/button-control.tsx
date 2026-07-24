'use client';

import { ChevronLeft, ChevronRight, CornerUpLeft, Shuffle } from "lucide-react";

interface ButtonControlProps {
  trackProgress: boolean;
  setTrackProgress: (t: boolean | ((prev: boolean) => boolean)) => void;
  currentIndex: number;
  totalCards: number;
  isAnimating: boolean;
  isShuffled: boolean;
  onPrev: () => void;
  onNextCorrect: () => void;
  onUndo: () => void;
  onShuffle: () => void;
}

export function ButtonControl({
  trackProgress,
  setTrackProgress,
  currentIndex,
  totalCards,
  isAnimating,
  isShuffled,
  onPrev,
  onNextCorrect,
  onUndo,
  onShuffle,
}: ButtonControlProps) {
  return (
    <div className="border-t border-gray-100 bg-white px-5 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Track progress toggle */}
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <span className="text-sm font-medium text-violet-600">Track progress</span>
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
            onClick={onPrev}
            disabled={currentIndex === 0 || isAnimating}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="min-w-[3.5rem] text-center">
            <span className="text-sm font-semibold text-gray-700">
              {currentIndex + 1} / {totalCards}
            </span>
          </div>

          <button
            onClick={onNextCorrect}
            disabled={isAnimating}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onUndo}
            disabled={currentIndex === 0 || isAnimating}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo"
          >
            <CornerUpLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onShuffle}
            disabled={isAnimating}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed ${isShuffled
                ? "bg-violet-100 text-violet-600 border-2 border-violet-300"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-600"
              }`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
