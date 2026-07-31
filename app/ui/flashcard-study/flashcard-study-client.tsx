'use client';

import { AnimatePresence } from "motion/react";
import type { FlashcardSetForStudy, CardProgressMap, StudySessionMeta } from "@/app/lib/definitions/flashcards";
import { useFlashcardStudy } from "./use-flashcard-study";
import { StudySummary } from "./study-summary";
import { CardItem } from "./card-item";
import { ButtonControl } from "./button-control";
import { FlashcardStudyHeader } from "./header";

interface Props {
  set: FlashcardSetForStudy;
  initialCardProgress?: CardProgressMap;
  initialStudySession?: StudySessionMeta | null;
  isOwner?: boolean;
}

export default function FlashcardStudyClient({
  set,
  initialCardProgress = {},
  initialStudySession = null,
  isOwner = true,
}: Props) {
  const study = useFlashcardStudy({ set, initialCardProgress, initialStudySession });

  if (!set) return null;

  if (study.showSummary) {
    return (
      <StudySummary
        trackProgress={study.trackProgress}
        set={set}
        correct={study.correct}
        incorrect={study.incorrect}
        total={study.cardStates.length}
        isSummaryLoading={study.isSummaryLoading}
        onRestart={study.handleRestart}
        onFocusStillLearning={study.handleFocusStillLearning}
      />
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-white flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <FlashcardStudyHeader
        id={set.id}
        title={set.title}
        isOwner={isOwner}
        handleRestart={study.handleRestart}
        currentIndex={study.currentIndex}
        totalCards={study.cardStates.length}
      />

      {/* Main flashcard area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 overflow-hidden">
        {/* Know / Still learning counter */}
        {study.trackProgress && (
          <div className="flex items-center justify-between w-full max-w-2xl mb-2 px-1 shrink-0">
            <span className="text-xs sm:text-sm text-red-400 font-semibold">
              {study.incorrect} Still learning
            </span>
            <span className="text-xs sm:text-sm text-emerald-500 font-semibold">
              Know {study.correct}
            </span>
          </div>
        )}

        {/* Sliding card */}
        <div className="rounded-3xl w-full max-w-2xl overflow-visible">
          <AnimatePresence mode="wait" custom={study.slideDirection}>
            <CardItem
              key={study.currentIndex}
              isOwner={isOwner}
              card={study.currentCardState.card}
              isFlipped={study.isFlipped}
              isAnimating={study.isAnimating}
              pendingResult={study.pendingResult}
              slideDirection={study.slideDirection}
              onClick={() => { if (!study.isAnimating) study.setIsFlipped((f) => !f); }}
              onVolumeClick={study.handleVolume}
              onCardUpdate={study.handleCardUpdate}
            />
          </AnimatePresence>
        </div>

        <div className="mt-2 bg-violet-50/80 rounded-xl px-3 py-1 flex items-center justify-center gap-1.5 text-[11px] text-violet-600 shrink-0">
          <span>⌨️</span>
          <kbd className="px-1.5 py-0.5 bg-white border border-violet-200 rounded-lg font-mono text-[9px] shadow-2xs">Space</kbd>
          <span>to flip •</span>
          <kbd className="px-1.5 py-0.5 bg-white border border-violet-200 rounded-lg font-mono text-[9px] shadow-2xs">←</kbd>
          <kbd className="px-1.5 py-0.5 bg-white border border-violet-200 rounded-lg font-mono text-[9px] shadow-2xs">→</kbd>
          <span>to navigate</span>
        </div>
      </div>

      {/* Bottom control bar */}
      <ButtonControl
        trackProgress={study.trackProgress}
        setTrackProgress={study.handleSetTrackProgress}
        currentIndex={study.currentIndex}
        totalCards={study.cardStates.length}
        isAnimating={study.isAnimating}
        isShuffled={study.isShuffled}
        onPrev={study.trackProgress ? () => study.markCard("incorrect") : study.goPrev}
        onNextCorrect={() => study.markCard("correct")}
        onUndo={study.handleUndo}
        onShuffle={study.handleShuffle}
      />
    </div>
  );
}
