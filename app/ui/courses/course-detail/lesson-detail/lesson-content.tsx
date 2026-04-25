'use client';

import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

import { DetailLesson } from "@/app/lib/definitions/lessons";

export function LessonContent({ lesson, courseId, lessonId }: { lesson: DetailLesson, courseId: string, lessonId: string }) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    // Navigate to quiz after 1 second
    setTimeout(() => {
      window.location.href = `/dashboard/courses/${courseId}/lesson/${lessonId}/quiz/`;
    }, 1000);
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

      {/* Complete Lesson Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-between bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100"
      >
        <div>
          <h3 className="text-2xl font-bold mb-2">Complete lesson</h3>
          <p className="text-gray-600">Earn {lesson.xp_reward} XP and keep going with the Quiz</p>
        </div>

        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all ${isCompleted
            ? "bg-emerald-500 text-white"
            : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105"
            }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-6 h-6" />
              Completed
            </>
          ) : (
            <>
              <CheckCircle2 className="w-6 h-6" />
              Complete & Take a quiz
            </>
          )}
        </button>
      </motion.div>

    </div>
  )
}