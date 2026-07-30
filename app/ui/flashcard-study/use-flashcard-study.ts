import { useState, useEffect, useCallback, useRef } from "react";
import type {
  FlashcardSetForStudy,
  FlashcardItemDTO,
  CardProgressMap,
  CardProgressUpdate,
  StudySessionMeta,
} from "@/app/lib/definitions/flashcards";
import {
  updateCardProgress,
  bulkUpdateCardProgress,
  resetSetProgress,
  upsertStudySession,
  logCompleteFlashcardSession,
} from "@/app/lib/actions/flashcard";
import { useSpeech } from "./use-speech";


export type AnswerStatus = "correct" | "incorrect" | null;

export interface CardState {
  card: FlashcardItemDTO;
  status: AnswerStatus;
}

export interface UseFlashcardStudyProps {
  set: FlashcardSetForStudy;
  initialCardProgress?: CardProgressMap;
  initialStudySession?: StudySessionMeta | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildInitialCardStates(
  set: FlashcardSetForStudy,
  initialCardProgress: CardProgressMap,
  savedTrackProgress: boolean
): CardState[] {
  return (set?.cards ?? []).map((card) => ({
    card,
    status: savedTrackProgress ? (initialCardProgress[card.id] ?? null) : null,
  }));
}

function resolveInitialIndex(
  set: FlashcardSetForStudy,
  initialStudySession: StudySessionMeta | null
): number {
  const savedIdx = initialStudySession?.lastCardIndex ?? 0;
  const maxIdx = Math.max(0, (set?.cards?.length ?? 1) - 1);
  return Math.min(savedIdx, maxIdx);
}

/** Tìm card chưa trả lời tiếp theo (status === null), bỏ qua các card đã "correct" */
function findNextNullIndex(states: CardState[], fromIndex: number): number {
  for (let i = fromIndex + 1; i < states.length; i++) {
    if (states[i].status === null) return i;
  }
  return -1;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFlashcardStudy({
  set,
  initialCardProgress = {},
  initialStudySession = null,
}: UseFlashcardStudyProps) {
  const savedTrackProgress = initialStudySession?.trackProgress ?? false;

  // ── State ──────────────────────────────────────────────────────────────────
  const [cardStates, setCardStates] = useState<CardState[]>(() =>
    buildInitialCardStates(set, initialCardProgress, savedTrackProgress)
  );
  const [trackProgress, setTrackProgress] = useState<boolean>(savedTrackProgress);
  const [currentIndex, setCurrentIndex] = useState<number>(() =>
    resolveInitialIndex(set, initialStudySession)
  );
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [slideDirection, setSlideDirection] = useState(1);
  const [pendingResult, setPendingResult] = useState<AnswerStatus>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFocusRound, setIsFocusRound] = useState(false);

  // ── TTS ────────────────────────────────────────────────────────────────────
  const { speakFront, speakBack } = useSpeech(
    set.frontLang ?? 'en-US',
    set.backLang ?? 'en-US'
  );

  // ── Derived ────────────────────────────────────────────────────────────────
  const currentCardState = cardStates[currentIndex];
  const correct = cardStates.filter((c) => c.status === "correct").length;
  const incorrect = cardStates.filter((c) => c.status === "incorrect").length;

  // ── Session persistence ────────────────────────────────────────────────────
  const saveIndexTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveSessionDebounced = useCallback(
    (trackProg: boolean, idx: number) => {
      if (saveIndexTimerRef.current) clearTimeout(saveIndexTimerRef.current);
      saveIndexTimerRef.current = setTimeout(() => {
        void upsertStudySession(set.id, { trackProgress: trackProg, lastCardIndex: idx });
      }, 500);
    },
    [set.id]
  );

  // ── Effects ────────────────────────────────────────────────────────────────

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Lưu lastCardIndex mỗi khi index thay đổi — cả 2 chế độ trackProgress ON/OFF
  // Đảm bảo user luôn quay lại đúng card khi thoát giữa chừng
  useEffect(() => {
    saveSessionDebounced(trackProgress, currentIndex);
  }, [currentIndex, trackProgress, saveSessionDebounced]);

  // ── Core navigation ────────────────────────────────────────────────────────

  const finishSession = useCallback(
    (updatedStates: CardState[]) => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      setShowSummary(true);

      void logCompleteFlashcardSession(set.id);

      if (trackProgress) {
        const allCorrect = updatedStates.every((cs) => cs.status === "correct");
        if (allCorrect) {
          // Session hoàn thành: tất cả cards đã thuộc → reset cho session mới
          void resetSetProgress(set.id);
          void upsertStudySession(set.id, { trackProgress: true, lastCardIndex: 0 });
        } else {
          const updates: CardProgressUpdate[] = updatedStates
            .filter((cs) => cs.status !== null)
            .map((cs) => ({
              cardId: cs.card.id,
              status: cs.status,
            }));
          void bulkUpdateCardProgress(set.id, updates);
        }
      } else {
        // trackProgress OFF: kết thúc session hoàn toàn
        void resetSetProgress(set.id);
        void upsertStudySession(set.id, { trackProgress: false, lastCardIndex: 0 });
      }
    },
    [set.id, trackProgress]
  );

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

        const cardId = currentCardState.card.id;
        void updateCardProgress(set.id, cardId, status);

        setTimeout(() => {
          const nextCardStates = cardStates.map((cs, i) =>
            i === currentIndex ? { ...cs, status } : cs
          );
          setCardStates(nextCardStates);
          setSlideDirection(status === "correct" ? 1 : -1);
          setIsFlipped(false);
          setPendingResult(null);
          setIsAnimating(false);

          if (isFocusRound) {
            const nextNull = findNextNullIndex(nextCardStates, currentIndex);
            if (nextNull >= 0) {
              setCurrentIndex(nextNull);
            } else {
              finishSession(nextCardStates);
            }
          } else {
            if (currentIndex < cardStates.length - 1) {
              setCurrentIndex((i) => i + 1);
            } else {
              finishSession(nextCardStates);
            }
          }
        }, 450);
      } else {
        setCardStates((prev) =>
          prev.map((cs, i) => (i === currentIndex ? { ...cs, status: null } : cs))
        );
        goNext();
      }
    },
    [isAnimating, trackProgress, currentCardState, set.id, cardStates, currentIndex, finishSession, goNext, isFocusRound]
  );

  // Keyboard shortcuts — sau khi markCard và goPrev đã được khai báo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isAnimating || showSummary) return;

      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          Boolean(
            target.closest("input, textarea, [contenteditable='true'], [role='dialog']")
          ));
      if (isInputFocused) return;

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
  }, [isAnimating, showSummary, trackProgress, markCard, goPrev]);

  // ── Compound handlers ──────────────────────────────────────────────────────

  /** Toggle track progress — lưu DB ngay, reset về card 0 nếu bật ON từ OFF */
  const handleSetTrackProgress = useCallback(
    (newVal: boolean | ((prev: boolean) => boolean)) => {
      const resolved = typeof newVal === "function" ? newVal(trackProgress) : newVal;
      setTrackProgress(resolved);

      if (saveIndexTimerRef.current) clearTimeout(saveIndexTimerRef.current);
      void upsertStudySession(set.id, {
        trackProgress: resolved,
        lastCardIndex: resolved ? currentIndex : 0,
      });

      // Bật ON từ OFF giữa chừng → về card đầu, xóa status cũ
      if (resolved && !trackProgress) {
        setCurrentIndex(0);
        setIsFlipped(false);
        setSlideDirection(1);
        setCardStates((prev) => prev.map((cs) => ({ ...cs, status: null })));
      }
    },
    [set.id, currentIndex, trackProgress]
  );

  /** Undo card vừa đánh dấu (chỉ có tác dụng khi trackProgress ON) */
  const handleUndo = useCallback(() => {
    if (isAnimating || currentIndex === 0) return;
    const prevIndex = currentIndex - 1;
    const prevCard = cardStates[prevIndex].card;

    if (trackProgress) {
      setCardStates((prev) =>
        prev.map((cs, i) => (i === prevIndex ? { ...cs, status: null } : cs))
      );
      void updateCardProgress(set.id, prevCard.id, null);
    }
    goPrev();
  }, [isAnimating, currentIndex, cardStates, trackProgress, set.id, goPrev]);

  /** Shuffle cards từ vị trí hiện tại trở về sau */
  const handleShuffle = useCallback(() => {
    if (isAnimating) return;
    setCardStates((prev) => {
      const before = prev.slice(0, currentIndex);
      const remaining = [...prev.slice(currentIndex)];
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      return [...before, ...remaining];
    });
    setIsFlipped(false);
    setIsShuffled(true);
  }, [isAnimating, currentIndex]);

  /** Restart toàn bộ set từ đầu */
  const handleRestart = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (trackProgress) void resetSetProgress(set.id);
    void upsertStudySession(set.id, { trackProgress, lastCardIndex: 0 });
    setCardStates((set?.cards ?? []).map((card) => ({ card, status: null })));
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowSummary(false);
    setPendingResult(null);
    setIsAnimating(false);
    setIsFocusRound(false);
  }, [set, trackProgress]);


  const handleFocusStillLearning = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const hasIncorrect = cardStates.some((cs) => cs.status === "incorrect");
    if (!hasIncorrect) return;

    // Reset cards 'incorrect' → null để đánh giá lại, giữ nguyên 'correct'
    const newCardStates = cardStates.map((cs) =>
      cs.status === "incorrect" ? { ...cs, status: null as AnswerStatus } : cs
    );
    setCardStates(newCardStates);

    // Nhảy đến card null đầu tiên trong toàn bộ set
    const firstNull = newCardStates.findIndex((cs) => cs.status === null);
    setCurrentIndex(firstNull >= 0 ? firstNull : 0);
    setIsFocusRound(true);
    setShowSummary(false);
    setIsFlipped(false);
    setPendingResult(null);
    setIsAnimating(false);
  }, [cardStates]);

  /** Update nội dung card sau khi chỉnh sửa inline */
  const handleCardUpdate = useCallback(
    (updatedCard: { id: string; front: string; back: string }) => {
      setCardStates((prev) =>
        prev.map((cs) =>
          cs.card.id === updatedCard.id
            ? { ...cs, card: { ...cs.card, front: updatedCard.front, back: updatedCard.back } }
            : cs
        )
      );
    },
    []
  );

  const handleVolume = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!currentCardState) return;
      if (isFlipped) {
        speakBack(currentCardState.card.back);
      } else {
        speakFront(currentCardState.card.front);
      }
    },
    [currentCardState, isFlipped, speakFront, speakBack]
  );

  // ── Public API ─────────────────────────────────────────────────────────────
  return {
    // State (read)
    cardStates,
    currentIndex,
    trackProgress,
    isFlipped,
    isShuffled,
    showSummary,
    slideDirection,
    pendingResult,
    isAnimating,
    // Derived (read)
    correct,
    incorrect,
    currentCardState,
    // Setters cần thiết cho JSX
    setIsFlipped,
    // Action handlers
    markCard,
    goPrev,
    handleSetTrackProgress,
    handleUndo,
    handleShuffle,
    handleRestart,
    handleFocusStillLearning,
    handleCardUpdate,
    handleVolume,
  };
}
