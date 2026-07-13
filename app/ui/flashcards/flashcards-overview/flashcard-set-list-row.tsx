'use client';

import { motion } from "motion/react";
import { Play } from "lucide-react";
import Link from "next/link";
import type { FlashcardSet } from "@/app/dashboard/flashcards/(overview)/page";
import ContextMenu from "./context-menu";
import { getColorClasses } from "@/app/lib/utils/color-palette";

interface Props {
  set: FlashcardSet;
  index: number;
  isMenuOpen: boolean;
  onMenuToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const user = {
  name: 'User',
  avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
}

export function FlashcardSetListRow({ set, index, isMenuOpen, onMenuToggle, onDelete }: Props) {
  const masteredPct = Math.round((set.mastered / set.cards.length) * 100);
  const { gradient } = getColorClasses(set.color);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 group"
    >
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{set.title}</h3>
          {!set.isPublic && (
            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-[10px] rounded-md flex-shrink-0 font-medium">Private</span>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-400">
          <span className="flex-shrink-0">{set.cards.length} cards</span>
          {set.lastStudied && <span className="truncate">Last studied: {set.lastStudied}</span>}
        </div>
      </div>

      {/* Avatar */}
      <div className="hidden sm:flex items-center gap-2 w-28 flex-shrink-0">
        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-white font-medium text-sm overflow-hidden flex-shrink-0">
          {user.avatar.startsWith('http') || user.avatar.startsWith('/') ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.avatar
          )}
        </div>
        <span className="font-medium text-xs text-gray-500 truncate">{user.name}</span>
      </div>

      {/* Progress bar */}
      <div className="w-36 hidden md:block flex-shrink-0">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{masteredPct}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${masteredPct}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <Link
          href={`/dashboard/flashcards/${set.id}`}
          className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-2 bg-indigo-500 text-white text-xs sm:text-sm font-medium rounded-xl hover:shadow-md transition-all`}
        >
          <Play className="w-3.5 h-3.5 sm:w-4 h-4" />
          Study
        </Link>
        <ContextMenu
          set={set}
          index={index}
          isMenuOpen={isMenuOpen}
          onMenuToggle={onMenuToggle}
          onDelete={onDelete}
        />
      </div>
    </motion.div>
  );
}
