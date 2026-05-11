'use client';

import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

import { DetailLesson } from "@/app/lib/definitions/lessons";
import Link from "next/link";
import { showQuestToasts } from "@/app/ui/quests/quest-toast";
import { QuestUpdateInfo } from "@/app/lib/definitions/quests";
import { StreakResult } from "@/app/lib/actions/streak";

export function LessonContent({
  lesson,
  courseId,
  lessonId,
  onComplete,
  isAlreadyCompleted = false,
}: {
  lesson: DetailLesson,
  courseId: string,
  lessonId: string,
  onComplete: () => Promise<{ success: boolean; xpEarned: number; questUpdates: QuestUpdateInfo[]; streakResult?: StreakResult }>,
  isAlreadyCompleted?: boolean,
}) {
  const [isCompleted, setIsCompleted] = useState(isAlreadyCompleted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [animTarget, setAnimTarget] = useState({ startX: 0, startY: 0, endX: 0 });

  const handleComplete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isCompleted || isSubmitting) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2 - 40;
    const startY = rect.top - 20;
    const endX = window.innerWidth - 80;
    setAnimTarget({ startX, startY, endX });

    setIsSubmitting(true);

    try {
      const result = await onComplete();

      if (!result?.success) {
        setIsSubmitting(false);
        return;
      }

      setIsCompleted(true);
      if (result.xpEarned > 0) {
        setXpAmount(result.xpEarned);
        setShowXp(true);
      }

      if (result.questUpdates?.length) {
        showQuestToasts(result.questUpdates);
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {lesson.lesson_type === "video" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
            <iframe
              width="100%"
              height="100%"
              src={lesson.video_url || ""}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </motion.div>
      )}

      {(lesson.lesson_type === "md" || lesson.lesson_type === "doc") && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="prose prose-lg prose-violet max-w-none bg-white rounded-3xl p-12 shadow-lg border-2 border-violet-100">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {lesson.content || ""}
            </ReactMarkdown>
          </div>
        </motion.div>
      )}

      {/* Complete Lesson / Take Quiz Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-between bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100"
      >
        <div>
          <h3 className="text-2xl font-bold mb-2">
            {isCompleted ? "Lesson completed!" : "Complete lesson"}
          </h3>
          <p className="text-gray-600">
            {isCompleted
              ? "Great job! You can now take the quiz."
              : `Earn ${lesson.xp_reward} XP and keep going with the Quiz`
            }
          </p>
        </div>

        {isCompleted ? (
          <Link
            href={`/dashboard/courses/${courseId}/lesson/${lessonId}/quiz/`}
            className="px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-105"
          >
            <CheckCircle2 className="w-6 h-6" />
            Take Quiz →
          </Link>
        ) : (
          <button
            onClick={handleComplete}
            disabled={isSubmitting}
            className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all ${isSubmitting
              ? "bg-gray-400 text-white cursor-wait"
              : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105"
              }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6" />
                Complete & Take a quiz
              </>
            )}
          </button>
        )}
      </motion.div>

      {/* Floating XP Animation */}
      <AnimatePresence>
        {showXp && (
          <motion.div
            initial={{
              opacity: 0,
              x: animTarget.startX,
              y: animTarget.startY,
              scale: 0.5
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: [animTarget.startX, animTarget.startX, animTarget.endX],
              y: [animTarget.startY, animTarget.startY - 100, 20],
              scale: [0.5, 1.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              times: [0, 0.2, 0.8, 1]
            }}
            className="fixed top-0 left-0 z-50 font-black text-3xl text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] pointer-events-none"
          >
            +{xpAmount} XP
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}