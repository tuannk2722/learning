'use client';

import { BookOpen, Clock, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { DynamicIcon } from "../../dynamic-icon";
import { CourseDetail } from "@/app/lib/definitions/courses";
import { getColorClasses } from "@/app/lib/utils/color-classes";


export function CourseInfo({
  course
}: {
  course: CourseDetail
}) {
  const colorClasses = getColorClasses(course.theme_color);
  const totalLessons = course.total_lessons;
  const totalDuration = course.total_duration;

  return (
    <div className="lg:col-span-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link href="/dashboard/courses" className="text-violet-600 hover:text-violet-700 flex items-center gap-1 mb-4 text-sm font-medium">
          ← Return to Courses
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className={`w-20 h-20 rounded-2xl ${colorClasses.bg} flex items-center justify-center shadow-xl`}>
            <DynamicIcon name={course.icon_name} className={`w-10 h-10 ${colorClasses.text}`} />
          </div>
          <div>
            <span className={`px-3 py-1 rounded-full text-xs ${colorClasses.bg} ${colorClasses.text} font-medium inline-block mb-2`}>
              {course.level}
            </span>
            <h1 className="text-5xl font-bold mb-2">{course.name}</h1>
          </div>
        </div>

        <p className="text-xl text-gray-600 mb-6">{course.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <BookOpen className="w-5 h-5 text-violet-600" />
            <span>{totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-5 h-5 text-violet-600" />
            <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-5 h-5 text-violet-600" />
            <span>{course.enrolled_count} students</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>{course.total_xp.toLocaleString('en-US')} XP</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}