'use client';

import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";

interface QuizAccessSectionProps {
  isCompleted: boolean;
  isAlreadyCompleted: boolean;
  courseId: string;
  lessonId: string;
}

export function QuizAccessSection({
  isCompleted,
  isAlreadyCompleted,
  courseId,
  lessonId,
}: QuizAccessSectionProps) {
  const showSection = isCompleted || isAlreadyCompleted;

  return (
    <AnimatePresence>
      {showSection && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-3xl p-8 shadow-lg border-2 border-emerald-100 gap-4"
        >
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold mb-2 text-emerald-800 flex items-center justify-center sm:justify-start gap-2">
              🎉 Lesson completed!
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Great job! Let's take the Quiz to check your knowledge.
            </p>
          </div>

          <Link
            href={`/dashboard/courses/${courseId}/lesson/${lessonId}/quiz/`}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-105"
          >
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            Take Quiz →
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
