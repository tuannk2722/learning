'use client';

import { motion } from 'motion/react';
import { Clock, Play } from 'lucide-react';
import Link from 'next/link';
import ContextMenu from './context-menu';
import { getColorClasses } from '@/app/lib/utils/color-palette';
import { deleteFlashcardSet } from '@/app/lib/actions/flashcard';
import type { FlashcardSetDTO } from '@/app/lib/definitions/flashcards';

interface Props {
  set: FlashcardSetDTO;
  index: number;
  isMenuOpen: boolean;
  canEdit: boolean;
  onMenuToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatRelativeTime(date: Date | null): string {
  if (!date) return 'Not studied yet';
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 2) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('vi-VN');
}

export function FlashcardSetCard({ set, index, isMenuOpen, canEdit, onMenuToggle, onDelete }: Props) {
  const masteredPct = set.cardCount > 0
    ? Math.round((set.masteredCount / set.cardCount) * 100)
    : 0;
  const { text, bg, gradient } = getColorClasses(set.themeColor);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{set.title}</h3>
          </div>

          {/* Context menu */}
          <ContextMenu
            set={set}
            index={index}
            isMenuOpen={isMenuOpen}
            canEdit={canEdit}
            onMenuToggle={onMenuToggle}
            onDelete={onDelete}
          />
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

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">{set.masteredCount}/{set.cardCount} mastered</span>
            <span className="text-xs font-semibold text-violet-600">{masteredPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${masteredPct}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
            />
          </div>
        </div>

        {/* Tags */}
        {set.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {set.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{formatRelativeTime(set.lastAccessed)}</span>
          </div>
          <Link
            href={`/dashboard/flashcards/${set.id}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 ${bg} ${text} text-sm font-medium rounded-xl hover:shadow-md hover:scale-105 transition-all`}
          >
            <Play className="w-3 h-3" />
            Study
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
