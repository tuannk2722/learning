'use client';

import { Plus } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export default function FlashcardHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-semibold">
              Flashcards
            </h1>
            <p className="text-sm text-muted-foreground">
              Study smart with interactive spaced repetition cards
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/flashcards/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 hover:scale-105 transition-all w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Create Set
        </Link>
      </div>
    </motion.div>
  )
}