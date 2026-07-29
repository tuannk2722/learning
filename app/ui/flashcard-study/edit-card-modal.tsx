'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2 } from 'lucide-react';
import { updateSingleCard } from '@/app/lib/actions/flashcard';
import type { FlashcardItemDTO } from '@/app/lib/definitions/flashcards';

interface EditCardModalProps {
  isOpen: boolean;
  card: FlashcardItemDTO;
  onClose: () => void;
  onSuccess: (updatedCard: { id: string; front: string; back: string }) => void;
}

export function EditCardModal({ isOpen, card, onClose, onSuccess }: EditCardModalProps) {
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state khi modal mở hoặc dữ liệu card thay đổi
  useEffect(() => {
    if (isOpen) {
      setFront(card.front);
      setBack(card.back);
      setErrorMsg(null);
    }
  }, [isOpen, card.front, card.back]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() && !back.trim()) {
      setErrorMsg('Front and back cannot both be empty.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);
      const result = await updateSingleCard(card.id, {
        front: front.trim(),
        back: back.trim(),
      });

      if (result.success) {

        onSuccess({
          id: card.id,
          front: front.trim(),
          back: back.trim(),
        });
        onClose();
      } else {
        setErrorMsg(result.message || 'Failed to update card.');
      }
    } catch (err) {
      console.error('[EditCardModal]', err);
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="edit-card-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => !isSaving && onClose()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {isSaving && (
            <div className="fixed inset-0 z-[99999] bg-white/10 backdrop-blur-sm cursor-wait" />
          )}

          <motion.div
            key="edit-card-modal-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-3xl w-full max-w-xl shadow-2xl p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit</h2>

            <form onSubmit={handleSave} className="space-y-6">
              {errorMsg && (
                <div className="p-3 text-xs text-red-600 bg-red-50 rounded-xl border border-red-100">
                  {errorMsg}
                </div>
              )}

              {/* Front Field (Term) */}
              <div className="space-y-2">
                {/* Toolbar */}
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-100/80 rounded-full">Term</div>

                {/* Input */}
                <textarea
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  placeholder="Enter term..."
                  rows={2}
                  className="w-full border-b-2 border-slate-700 py-2 text-base text-gray-900 focus:outline-none focus:border-blue-600 transition-colors resize-none bg-transparent"
                />
              </div>

              {/* Back Field (Definition) */}
              <div className="space-y-2">
                {/* Toolbar */}
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-100/80 rounded-full">Definition</div>

                {/* Input */}
                <textarea
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  placeholder="Enter definition..."
                  rows={2}
                  className="w-full border-b-2 border-slate-700 py-2 text-base text-gray-900 focus:outline-none focus:border-blue-600 transition-colors resize-none bg-transparent"
                />
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

