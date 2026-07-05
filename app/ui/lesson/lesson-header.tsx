'use client';
import { DetailLesson } from "@/app/lib/definitions/lessons";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CourseRating } from "../course-detail/course-rating";
import { motion } from "motion/react";

export function LessonDetailHeader({ lesson, initialRating }: { lesson: DetailLesson, initialRating?: number | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 ">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <Link
            href={`/dashboard/courses/${lesson.course_id}`}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-100/50 transition-all hover:scale-105 shrink-0"
            title={`Return to ${lesson.courseTitle}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="text-xs font-semibold text-violet-600/80 mb-0.5 uppercase tracking-wider">
              {lesson.courseTitle}
            </div>
            {/* <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
              {lesson.title}
            </h1> */}
          </div>
        </div>

        {/* Rating */}
        {/* <div className="flex-shrink-0">
          <CourseRating courseId={lesson.course_id} initialRating={initialRating} />
        </div> */}
      </div>
    </motion.div>
  );
}

