'use client';

import { motion } from "motion/react";
import { Clock, Play } from "lucide-react";
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

export function FlashcardSetCard({ set, index, isMenuOpen, onMenuToggle, onDelete }: Props) {
  const masteredPct = Math.round((set.mastered / set.cards.length) * 100);
  const { gradient } = getColorClasses(set.color);

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
            onMenuToggle={onMenuToggle}
            onDelete={onDelete}
          />
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-1 mb-3">
          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-white font-medium text-sm overflow-hidden">
            {user.avatar.startsWith('http') || user.avatar.startsWith('/') ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.avatar
            )}
          </div>
          <span className="font-medium text-xs text-gray-500">{user.name}</span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">{set.mastered}/{set.cards.length} mastered</span>
            <span className="text-xs font-semibold text-violet-600">{masteredPct}%</span>
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

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {set.lastStudied ? `Studied ${set.lastStudied}` : "Not studied yet"}
          </div>
          <Link
            href={`/dashboard/flashcards/${set.id}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-xl hover:shadow-md hover:scale-105 transition-all`}
          >
            <Play className="w-3 h-3" />
            Study
          </Link>
        </div>
      </div>
    </motion.div >
  );
}
