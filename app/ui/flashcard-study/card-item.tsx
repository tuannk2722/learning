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
            <div className="flex-grow flex flex-col items-center justify-center py-4">
              <div className={`text-gray-900 leading-snug text-center ${card.front.length <= 4 ? "text-4xl"
                : card.front.length <= 10 ? "text-3xl"
                  : "text-2xl"
                }`}>
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
            <div className="flex-grow flex items-center justify-center py-4 overflow-hidden">
              {(() => {
                const imgUrl = card.imageUrl || (card as any).image_url;
                if (imgUrl) {
                  return (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full h-full px-4">
                      <div className="flex-1 text-center text-gray-900 leading-snug text-3xl">
                        {card.back ? card.back : "..."}
                      </div>
                      <div className="flex-shrink-0 w-64 h-52 sm:w-64 sm:h-52 relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center p-1.5 shadow-sm">
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
                  <div className={`text-gray-900 leading-snug text-center ${card.back.length <= 4 ? "text-3xl"
                    : card.back.length <= 10 ? "text-2xl"
                      : "text-xl"
                    }`}>
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
