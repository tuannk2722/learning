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
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
    >
      <div className="p-5">
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

        {/* Tags */}
        {set.tags.length > 0 && (
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {set.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={`/dashboard/flashcards/${set.id}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 mt-2 bg-blue-400 text-white text-sm font-medium rounded-xl hover:shadow-md hover:scale-105 transition-all`}
            >
              <Play className="w-3 h-3" />
              Study
            </Link>
          </div>
        )}

      </div>
    </motion.div>
  );
}
