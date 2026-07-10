'use client';

import { motion } from "motion/react";
import { Trash2, Image, GripVertical } from "lucide-react";

export interface EditableCard {
  id: string;
  front: string;
  back: string;
  hint: string;
}

interface BuilderCardItemProps {
  card: EditableCard;
  index: number;
  canDelete: boolean;
  onUpdate: (id: string, field: keyof EditableCard, value: string) => void;
  onDelete: (id: string) => void;
}

export function BuilderCardItem({
  card,
  index,
  canDelete,
  onUpdate,
  onDelete,
}: BuilderCardItemProps) {

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className="bg-white rounded-2xl border-2 transition-all shadow-sm shadow-violet-100">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-400">{index + 1}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDelete(card.id)}
            disabled={!canDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            title="Delete card"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card inputs */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-6">
          {/* Front (Term) */}
          <div className="relative">
            <textarea
              value={card.front}
              onChange={(e) => onUpdate(card.id, "front", e.target.value)}
              placeholder="E.g: Photosynthesis"
              rows={2}
              className="rounded-xl w-full px-0 py-2 text-base font-semibold text-gray-900 bg-transparent resize-none focus:outline-none placeholder:text-gray-200 placeholder:font-normal border-b border-gray-100 focus:border-violet-300 transition-colors"
            />
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest mt-1 block">
              Term
            </label>
          </div>

          {/* Back (Definition) */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={card.back}
                onChange={(e) => onUpdate(card.id, "back", e.target.value)}
                placeholder="E.g: abc"
                rows={2}
                className="rounded-xl w-full px-0 py-2 text-base font-semibold text-gray-900 bg-transparent resize-none focus:outline-none placeholder:text-gray-200 placeholder:font-normal border-b border-gray-100 focus:border-violet-300 transition-colors"
              />
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-widest mt-1 block">
                Definition
              </label>
            </div>

            {/* Image placeholder */}
            <button
              className="flex-shrink-0 w-16 h-16 self-start border-2 border-dashed border-gray-400 rounded-xl hover:border-violet-300 hover:bg-violet-50 transition-all flex flex-col items-center justify-center gap-1 text-gray-300 hover:text-violet-400"
              title="Add image"
            >
              <Image className="w-5 h-5" />
              <span className="text-[10px] leading-none font-medium">Image</span>
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
