'use client';

import { forwardRef, useState } from "react";
import { motion } from "motion/react";
import { Edit2, Volume2 } from "lucide-react";
import type { FlashcardItemDTO } from "@/app/lib/definitions/flashcards";
import { EditCardModal } from "./edit-card-modal";

type AnswerStatus = "correct" | "incorrect" | null;

interface CardItemProps {
  isOwner: boolean;
  card: FlashcardItemDTO;
  isFlipped: boolean;
  isAnimating: boolean;
  pendingResult: AnswerStatus;
  slideDirection: number;
  onClick: () => void;
  onVolumeClick: (e: React.MouseEvent) => void;
  onCardUpdate?: (updatedCard: { id: string; front: string; back: string }) => void;
}

function getFrontFontSize(text: string): string {
  const len = text.length;
  const lineCount = text.split('\n').length;

  if (len <= 15 && lineCount === 1) return "text-3xl sm:text-4xl font-bold";
  if (len <= 40 && lineCount <= 2) return "text-2xl sm:text-3xl font-semibold";
  if (len <= 100 && lineCount <= 4) return "text-xl sm:text-2xl font-semibold";
  if (len <= 200 && lineCount <= 6) return "text-lg sm:text-xl font-medium";
  return "text-base font-medium";
}

function getBackFontSize(text: string, hasImage: boolean): string {
  const len = text.length;
  const lineCount = text.split('\n').length;

  if (hasImage) {
    if (len <= 25 && lineCount <= 2) return "text-xl sm:text-2xl font-semibold";
    if (len <= 80 && lineCount <= 4) return "text-lg sm:text-xl font-medium";
    if (len <= 180 && lineCount <= 6) return "text-base sm:text-lg font-medium";
    return "text-sm font-normal";
  }

  if (len <= 20 && lineCount === 1) return "text-2xl sm:text-3xl font-semibold";
  if (len <= 60 && lineCount <= 3) return "text-xl sm:text-2xl font-semibold";
  if (len <= 140 && lineCount <= 5) return "text-lg sm:text-xl font-medium";
  if (len <= 280 && lineCount <= 8) return "text-base sm:text-lg font-medium";
  return "text-sm sm:text-base font-normal";
}

export const CardItem = forwardRef<HTMLDivElement, CardItemProps>(({
  isOwner,
  card,
  isFlipped,
  isAnimating,
  pendingResult,
  slideDirection,
  onClick,
  onVolumeClick,
  onCardUpdate,
  ...props
}, ref) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Animation values for flying out
  const flyX = pendingResult === "correct" ? 50 : pendingResult === "incorrect" ? -50 : 0;
  const flyRotate = pendingResult === "correct" ? 1 : pendingResult === "incorrect" ? -1 : 0;

  return (
    <>
      <motion.div
        ref={ref}
        {...props}
        initial={{ opacity: 0, x: slideDirection * 60 }}
        animate={
          pendingResult
            ? { opacity: 0, x: flyX, rotate: flyRotate, scale: 0.95 }
            : { opacity: 1, x: 0, rotate: 0, scale: 1 }
        }
        exit={
          pendingResult
            ? { opacity: 0, x: flyX, rotate: flyRotate, scale: 0.95 }
            : { opacity: 0, x: -slideDirection * 60 }
        }
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ perspective: 1200 }}
        className="w-full cursor-pointer select-none"
        onClick={onClick}
      >
        {/* Flip inner — rotates on click */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformStyle: "preserve-3d", position: "relative", minHeight: 320 }}
        >
          {/* ── Front face ── */}
          <div
            className={`absolute inset-0 bg-white rounded-3xl border-2 shadow-lg hover:shadow-xl transition-shadow p-4 flex flex-col justify-between ${pendingResult === "correct"
              ? "border-[#a7f3d0]"
              : pendingResult === "incorrect"
                ? "border-[#fed7aa]"
                : "border-gray-100"
              }`}
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Overlay for pending animation */}
            {pendingResult && (
              <div className="absolute inset-0 bg-white rounded-3xl flex items-center justify-center z-20">
                {pendingResult === "correct" ? (
                  <span className="text-[#3ccfcf] text-4xl font-bold tracking-tight select-none">Know</span>
                ) : (
                  <span className="text-[#ff9f59] text-4xl font-bold tracking-tight select-none">Still learning</span>
                )}
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Term</span>
              <div className="w-full max-w-2xl flex items-center justify-end gap-5 mb-2 px-5">
                {isOwner && (
                  <button
                    type="button"
                    className="text-gray-500 hover:text-blue-400 transition-colors p-1"
                    title="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  className="text-gray-500 hover:text-blue-400 transition-colors p-1"
                  title="Sound"
                  onClick={onVolumeClick}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow flex flex-col items-center justify-center py-4 overflow-y-auto max-h-full">
              <div className={`text-gray-900 leading-relaxed text-center whitespace-pre-wrap ${getFrontFontSize(card.front)}`}>
                {card.front ? card.front : "..."}
              </div>
            </div>
          </div>

          {/* ── Back face ── */}
          <div
            className={`absolute inset-0 bg-white rounded-3xl border-2 shadow-lg hover:shadow-xl transition-shadow p-4 flex flex-col justify-between ${pendingResult === "correct"
              ? "border-[#a7f3d0]"
              : pendingResult === "incorrect"
                ? "border-[#fed7aa]"
                : "border-violet-100"
              }`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {/* Overlay for pending animation */}
            {pendingResult && (
              <div className="absolute inset-0 bg-white rounded-3xl flex items-center justify-center z-20">
                {pendingResult === "correct" ? (
                  <span className="text-[#3ccfcf] text-6xl font-bold tracking-tight select-none">Know</span>
                ) : (
                  <span className="text-[#ff9f59] text-6xl font-bold tracking-tight select-none">Still learning</span>
                )}
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Definition</span>
              <div className="w-full max-w-2xl flex items-center justify-end gap-5 mb-2 px-5">
                {isOwner && (
                  <button
                    type="button"
                    className="text-gray-500 hover:text-blue-400 transition-colors p-1"
                    title="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  title="Sound"
                  className="text-gray-500 hover:text-blue-400 transition-colors p-1"
                  onClick={onVolumeClick}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow flex items-center justify-center py-4 overflow-y-auto max-h-full">
              {(() => {
                const imgUrl = card.imageUrl || (card as any).image_url;
                if (imgUrl) {
                  const hasBackText = Boolean(card.back && card.back.trim());
                  return (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full h-full px-4">
                      {hasBackText && (
                        <div className={`flex-1 text-center text-gray-900 leading-relaxed whitespace-pre-wrap ${getBackFontSize(card.back, true)}`}>
                          {card.back}
                        </div>
                      )}
                      <div className={
                        hasBackText
                          ? "flex-shrink-0 w-64 h-52 sm:w-64 sm:h-52 relative flex items-center justify-center"
                          : "w-full max-w-md h-56 sm:h-64 relative flex items-center justify-center"
                      }>
                        <img
                          src={imgUrl}
                          alt="Definition illustration"
                          className="max-w-full max-h-full object-contain rounded-xl"
                        />
                      </div>
                    </div>
                  );
                }
                return (
                  <div className={`text-gray-900 leading-relaxed text-center whitespace-pre-wrap ${getBackFontSize(card.back, false)}`}>
                    {card.back ? card.back : "..."}
                  </div>
                );
              })()}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <EditCardModal
        isOpen={isEditModalOpen}
        card={card}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={(updated) => {
          onCardUpdate?.(updated);
        }}
      />
    </>
  );
});

CardItem.displayName = "CardItem";
