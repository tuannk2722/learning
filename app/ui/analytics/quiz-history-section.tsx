"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { CheckCircle2, XCircle, Zap, ClipboardList, ChevronRight } from "lucide-react";
import { QuizAttemptSummary } from "@/app/lib/definitions/quizzes";

interface Props {
  attempts: QuizAttemptSummary[];
}

export function QuizHistorySection({ attempts }: Props) {
  if (attempts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-center"
      >
        <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-400">No quiz attempts yet</h3>
        <p className="text-sm text-gray-400 mt-1">Complete a lesson and take a quiz to see your history here.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-violet-100">
          <ClipboardList className="w-5 h-5 text-violet-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Quiz History</h2>
        <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
          {attempts.length} attempt{attempts.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400">
          <div className="col-span-4">Quiz</div>
          <div className="col-span-2 text-center">Score</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-center">XP</div>
          <div className="col-span-2 text-right">Date</div>
        </div>

        {/* Rows */}
        {attempts.map((attempt, idx) => {
          const percentage = Math.round((attempt.score / attempt.total) * 100);
          const formattedDate = new Date(attempt.completedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <Link
              key={attempt.id}
              href={`/dashboard/courses/${attempt.courseId}/lesson/${attempt.lessonId}/quiz/result/${attempt.id}`}
              className="block group"
            >
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center border-b border-gray-50 hover:bg-violet-50/50 transition-colors ${idx === attempts.length - 1 ? "border-b-0" : ""}`}
              >
                {/* Quiz & Lesson Name */}
                <div className="col-span-4">
                  <div className="font-semibold text-gray-800 group-hover:text-violet-700 transition-colors flex items-center gap-2">
                    {attempt.quizTitle}
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-500 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{attempt.lessonTitle}</div>
                </div>

                {/* Score */}
                <div className="col-span-2 text-center">
                  <span className="font-bold text-gray-700">{attempt.score}/{attempt.total}</span>
                  <span className="text-xs text-gray-400 ml-1">({percentage}%)</span>
                </div>

                {/* Status */}
                <div className="col-span-2 text-center">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${attempt.passed
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                    }`}>
                    {attempt.passed
                      ? <><CheckCircle2 className="w-3.5 h-3.5" /> Passed</>
                      : <><XCircle className="w-3.5 h-3.5" /> Failed</>
                    }
                  </span>
                </div>

                {/* XP */}
                <div className="col-span-2 text-center">
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600">
                    <Zap className="w-3.5 h-3.5" />+{attempt.xpEarned}
                  </span>
                </div>

                {/* Date */}
                <div className="col-span-2 text-right text-sm text-gray-400">
                  {formattedDate}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
