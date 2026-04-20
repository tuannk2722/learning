'use client';

import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Clock, Code2, FileText, Play } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function LessonContent({ lesson, courseId, lessonId }: any) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    // Navigate to quiz after 1 second
    setTimeout(() => {
      window.location.href = `/dashboard/courses/${courseId}/lesson/${lessonId}/quiz/`;
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {lesson.type === "video" && (
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
              src={lesson.videoUrl}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </motion.div>
      )}

      {lesson.type === "docs" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="prose prose-lg max-w-none mb-8"
        >
          <div className="bg-white rounded-3xl p-12 shadow-lg border-2 border-violet-100">
            <div className="markdown-content" dangerouslySetInnerHTML={{
              __html: lesson.content
                .replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold mb-6 text-gray-900">$1</h1>')
                .replace(/^## (.+)$/gm, '<h2 class="text-3xl font-bold mt-8 mb-4 text-gray-900">$1</h2>')
                .replace(/^### (.+)$/gm, '<h3 class="text-2xl font-bold mt-6 mb-3 text-gray-900">$1</h3>')
                .replace(/```javascript\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-6 rounded-2xl overflow-x-auto my-6"><code>$1</code></pre>')
                .replace(/`([^`]+)`/g, '<code class="bg-violet-100 text-violet-700 px-2 py-1 rounded">$1</code>')
                .replace(/^\d+\. (.+)$/gm, '<li class="ml-6 mb-2">$1</li>')
                .replace(/^- (.+)$/gm, '<li class="ml-6 mb-2">$1</li>')
                .replace(/\n\n/g, '<p class="mb-4">')
            }} />
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
          <h3 className="text-2xl font-bold mb-2">Complete course</h3>
          <p className="text-gray-600">Earn {lesson.xp} XP and keep going with the Quiz</p>
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