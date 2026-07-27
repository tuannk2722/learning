'use client';

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Pencil, RotateCcw, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export function FlashcardStudyHeader({
  id,
  title,
  isOwner,
  handleRestart,
  currentIndex,
  totalCards
}: {
  id: string;
  title: string;
  isOwner: boolean;
  handleRestart: () => void;
  currentIndex: number;
  totalCards: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100 shrink-0">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
          animate={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Top Header Actions Bar */}
      <div className="xl:px-10 px-4 py-2 flex items-center justify-between z-20 shrink-0 relative">
        <Link
          href="/dashboard/flashcards"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return</span>
          <span className="hidden sm:block ml-[-2.5px]">to Flashcards</span>
        </Link>

        <div className="font-semibold text-xs sm:text-sm text-gray-800 truncate px-2 max-w-[160px] sm:max-w-xs md:max-w-md">
          {title}
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2">
          {isOwner && (
            <Link
              href={`/dashboard/flashcards/${id}/edit`}
              scroll={true}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-100 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>

        {/* Mobile Dropdown Menu (3 dots) */}
        <div className="sm:hidden relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-1 w-36 bg-white rounded-2xl border border-gray-100 shadow-lg p-1.5 z-50 flex flex-col gap-1"
              >
                {isOwner && (
                  <Link
                    href={`/dashboard/flashcards/${id}/edit`}
                    scroll={true}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5 text-gray-500" />
                    <span>Edit</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    handleRestart();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-all w-full text-left cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}