'use client';

import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { parseLessonBlocks } from "@/app/lib/definitions/lessons";
import { CodeBlock } from "./lesson-code-block";

import { DetailLesson } from "@/app/lib/definitions/lessons";
import Link from "next/link";
import { showQuestToasts } from "@/app/ui/quests/quest-toast";
import { showAchievementToasts } from "@/app/ui/achievement/achievement-toast";
import { QuestUpdateInfo } from "@/app/lib/definitions/quests";
import { StreakResult, UnlockedAchievement } from "@/app/lib/definitions/definitions";

interface LessonContentProps {
  lesson: DetailLesson;
  courseId: string;
  lessonId: string;
  onComplete: () => Promise<{ success: boolean; xpEarned: number; questUpdates: QuestUpdateInfo[]; streakResult?: StreakResult; unlockedAchievements?: UnlockedAchievement[] }>;
  isAlreadyCompleted?: boolean;
}

export function LessonContent({
  lesson,
  courseId,
  lessonId,
  onComplete,
  isAlreadyCompleted = false,
}: LessonContentProps) {
  const [isCompleted, setIsCompleted] = useState(isAlreadyCompleted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);

  const handleComplete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isCompleted || isSubmitting) return;

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
        // Hide XP after animation finishes
        setTimeout(() => setShowXp(false), 1500);
      }

      if (result.questUpdates?.length) {
        showQuestToasts(result.questUpdates);
      }

      if (result.unlockedAchievements?.length) {
        showAchievementToasts(result.unlockedAchievements);
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  const blocks = parseLessonBlocks(lesson.blocks);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-violet-100/50 space-y-6 mb-8"
      >
        {blocks.map((block) => (
          <div key={block.id}>
            {block.type === 'text' && (
              <div className="prose prose-lg prose-violet max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {block.content}
                </ReactMarkdown>
              </div>
            )}

            {block.type === 'video' && (
              <div className="my-8 aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                <iframe
                  width="100%"
                  height="100%"
                  src={block.content}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            )}

            {block.type === 'image' && (
              <div className="my-8 flex flex-col items-center">
                <img
                  src={block.content}
                  alt={block.metadata?.caption || 'Lesson Illustration'}
                  className="rounded-2xl max-h-[500px] object-contain w-full shadow-md border border-slate-100"
                />
                {block.metadata?.caption && (
                  <p className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-widest text-center">
                    {block.metadata.caption}
                  </p>
                )}
              </div>
            )}

            {block.type === 'code' && (
              <div className="my-8">
                <CodeBlock
                  code={block.content}
                  filename={block.metadata?.filename}
                  language={block.metadata?.language}
                />
              </div>
            )}
          </div>
        ))}
      </motion.div>

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

        <div className="relative">
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

          {/* Floating XP Animation */}
          <AnimatePresence>
            {showXp && (
              <motion.div
                initial={{ opacity: 0, y: 0, x: "-50%", left: "50%" }}
                animate={{ opacity: 1, y: -60 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 z-50 font-black text-3xl text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] pointer-events-none whitespace-nowrap"
              >
                +{xpAmount} XP
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

    </div>
  );
}