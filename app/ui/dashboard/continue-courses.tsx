'use client';

import { motion } from "motion/react";
import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { CourseListing } from "@/app/lib/definitions/courses";
import { getColorClasses } from "@/app/lib/utils/color-palette";

export function ContinueCourses({ data }: { data: CourseListing[] }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Continue Learning</h2>
        </div>
        <Link href="/dashboard/courses" className="text-violet-600 hover:text-violet-700 flex items-center gap-1 text-sm font-medium">
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-6">
        {data.map((course, index) => {
          const colorClasses = getColorClasses(course.theme_color);
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href={`/dashboard/courses/${course.id}`} className="block">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-violet-600 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-600">{course.current_lesson || "Completed"}</p>
                  </div>
                  {/* <div className="text-sm font-medium text-gray-700">
                  {course.completedLessons}/{course.totalLessons}
                </div> */}
                </div>
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${colorClasses.gradient} rounded-full`}
                    style={{ width: `${course.progress_percent}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2">{course.progress_percent}% completed</div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <Link
        href="/dashboard/courses"
        className="mt-6 w-full py-3 border-2 border-violet-300 text-violet-700 rounded-xl hover:bg-violet-50 transition-all flex items-center justify-center gap-2 font-medium"
      >
        Discover New Courses
        <ChevronRight className="w-5 h-5" />
      </Link>
    </motion.div>
  )
}