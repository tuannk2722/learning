'use client';
import { ChevronLeft, ChevronRight, Clock, Code2, FileText, Play } from "lucide-react";
import Link from "next/link";

export function LessonDetailHeader({ lesson, courseId }: any) {

  return (
    <div className="bg-white border-b border-gray-200 top-[73px] z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link
          href={`/dashboard/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 mb-4 font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Return to: {lesson.courseTitle}
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                Lessons {lesson.lessonNumber}/{lesson.totalLessons}
              </span>
              {lesson.type === "video" && (
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Play className="w-4 h-4" />
                  Video
                </span>
              )}
              {lesson.type === "docs" && (
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  Docs
                </span>
              )}
              {lesson.type === "code" && (
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Code2 className="w-4 h-4" />
                  Coding
                </span>
              )}
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {lesson.estimatedTime} minutes
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-3 rounded-xl border-2 border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all">
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-3 rounded-xl border-2 border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all">
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Course progress</span>
            <span>{Math.round((lesson.lessonNumber / lesson.totalLessons) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all"
              style={{ width: `${(lesson.lessonNumber / lesson.totalLessons) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}