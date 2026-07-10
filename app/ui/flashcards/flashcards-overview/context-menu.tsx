"use client";

import { Edit3, MoreHorizontal, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { FlashcardSet } from "@/app/dashboard/flashcards/(overview)/page";

interface Props {
  set: FlashcardSet;
  index: number;
  isMenuOpen: boolean;
  onMenuToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ContextMenu({ set, index, isMenuOpen, onMenuToggle, onDelete }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onMenuToggle(set.id);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, onMenuToggle, set.id]);

  return (
    <div ref={menuRef} className="relative flex-shrink-0 ml-2">
      <button
        onClick={() => onMenuToggle(set.id)}
        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
      >
        <MoreHorizontal className="w-4 h-4 text-gray-400" />
      </button>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -4 }}
            className="absolute right-0 top-8 bg-white rounded-xl border border-gray-100 shadow-xl z-20 py-1 min-w-[8rem]"
          >
            <Link
              href={`/dashboard/flashcards/${set.id}/edit`}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </Link>
            <button
              onClick={() => onDelete(set.id)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}