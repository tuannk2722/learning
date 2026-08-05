'use client';

import { motion } from "motion/react";
import Link from "next/link";
import type { FlashcardSetProgressDTO } from "@/app/lib/data/flashcard";

export function RecentFlashcards({ flashcards = [] }: { flashcards?: FlashcardSetProgressDTO[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.65 }}
      className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-8 shadow-lg text-white"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
            🃏
          </div>
          <div>
            <h3 className="text-lg font-bold">Flashcards</h3>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {flashcards.length > 0 ? (
          flashcards.map((s) => (
            <Link
              key={s.id}
              href={`/dashboard/flashcards/${s.id}`}
              className="bg-white/10 hover:bg-white/20 transition-all rounded-2xl p-3 block group"
            >
              <div className="text-xs text-violet-200 mb-1.5 truncate font-medium">{s.title}</div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-300" style={{ width: `${s.pct}%` }} />
              </div>
              <div className="text-xs text-white font-semibold mt-1">{s.pct}%</div>
            </Link>
          ))
        ) : (
          <div className="col-span-3 text-center py-6 bg-white/5 rounded-2xl text-violet-200 text-xs">
            Not studying flashcards yet
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <Link
          href="/dashboard/flashcards"
          className="flex-1 py-2.5 bg-white text-violet-700 rounded-xl text-sm font-bold text-center hover:shadow-lg transition-all"
        >
          Study now
        </Link>
        <Link
          href="/dashboard/flashcards/create"
          className="flex-1 py-2.5 bg-white/20 border border-white/30 text-white rounded-xl text-sm font-medium text-center hover:bg-white/30 transition-all"
        >
          + Create new set
        </Link>
      </div>
    </motion.div>
  );
}
