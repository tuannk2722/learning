'use client';
import { DetailLesson } from "@/app/lib/definitions/lessons";
import { ChevronLeft, Clock } from "lucide-react";
import Link from "next/link";
import { CourseRating } from "../course-detail/course-rating";

export function LessonDetailHeader({ lesson, initialRating }: { lesson: DetailLesson, initialRating?: number | null }) {

  return (
    <div className="bg-white border-b border-gray-200 top-[73px] z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link
          href={`/dashboard/courses/${lesson.course_id}`}
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
              <span className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {lesson.duration_minutes} minutes
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
          </div>

          {/* Rating */}
          <div className="flex-shrink-0">
            <CourseRating courseId={lesson.course_id} initialRating={initialRating} />
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