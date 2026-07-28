'use client';

import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import Link from 'next/link';
import type { FlashcardSetDTO } from '@/app/lib/definitions/flashcards';

interface Props {
  set: FlashcardSetDTO;
  index: number;
}

export function FlashcardSetCard({ set, index }: Props) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden h-full"
    >
      <div className="p-5 flex flex-col justify-between h-full">
        <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-semibold text-gray-900 text-md truncate">{set.title}</h3>
          </div>

          <span className="text-sm font-semibold text-gray-600">{set.cardCount} cards</span>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-1 mb-3">
          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-white font-medium text-sm overflow-hidden">
            {set.ownerAvatar ? (
              <img src={set.ownerAvatar} alt={set.ownerName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] text-gray-500">{set.ownerName[0]}</span>
            )}
          </div>
          <span className="font-medium text-xs text-gray-500">{set.ownerName}</span>
        </div>
      </div>

        {/* Footer: Tags & Action */}
        <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between gap-2 min-h-[42px]">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {set.tags && set.tags.length > 0 ? (
              set.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium px-2.5 py-0.5 bg-slate-100/80 text-slate-600 rounded-md border border-slate-200/60 truncate max-w-[100px]"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400 italic">No tags</span>
            )}
          </div>

          <Link
            href={`/dashboard/flashcards/${set.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow-md transition-all shrink-0 ml-auto group/btn"
          >
            <Play className="w-3.5 h-3.5 fill-current transition-transform group-hover/btn:scale-110" />
            Study
          </Link>
        </div>

      </div>
    </motion.div>
  );
}
