'use client';

import { motion } from "motion/react";
import { CheckCircle2, BarChart3, Trophy } from "lucide-react";
import Link from "next/link";
import type { FlashcardSet } from "@/app/dashboard/flashcards/(overview)/page";

interface StudySummaryProps {
  set: FlashcardSet;
  correct: number;
  incorrect: number;
  total: number;
  onRestart: () => void;
}

export function StudySummary({ set, correct, incorrect, total, onRestart }: StudySummaryProps) {
  const pct = Math.round((correct / total) * 100);
  const isPerfect = correct === total;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex flex-col">

      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10 w-full max-w-md text-center"
        >
          {/* Result icon */}
          <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center ${isPerfect ? "bg-amber-100" : pct >= 70 ? "bg-violet-100" : "bg-gray-100"
            }`}>
            {isPerfect ? (
              <Trophy className="w-10 h-10 text-amber-500" />
            ) : pct >= 70 ? (
              <CheckCircle2 className="w-10 h-10 text-violet-500" />
            ) : (
              <BarChart3 className="w-10 h-10 text-gray-400" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isPerfect ? "Perfect! 🎉" : pct >= 70 ? "Great Job! 💪" : "Keep practicing! 📚"}
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            You've completed <strong className="text-gray-900">{set.title}</strong>
          </p>

          {/* Score ring */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="52" fill="none" stroke="#f3f4f6" strokeWidth="12" />
              <circle
                cx="64" cy="64" r="52"
                fill="none"
                stroke={pct === 100 ? "#f59e0b" : pct >= 70 ? "#7c3aed" : "#e5e7eb"}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{pct}%</span>
              <span className="text-xs text-gray-400">accuracy</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-500">{correct}</div>
              <div className="text-xs text-gray-400 mt-0.5">Mastered</div>
            </div>
            <div className="text-center border-x border-gray-100">
              <div className="text-2xl font-bold text-gray-700">{total}</div>
              <div className="text-xs text-gray-400 mt-0.5">Total Cards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{incorrect}</div>
              <div className="text-xs text-gray-400 mt-0.5">To Review</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              // onClick={onRestart}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all"
            >
              Focus on {incorrect} Still learning cards
            </button>
            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
            >
              Restart Flashcards
            </button>
            <Link
              href="/dashboard/flashcards"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 rounded-2xl font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Sets
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
