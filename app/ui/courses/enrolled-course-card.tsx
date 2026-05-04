'use client';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import Link from 'next/link';
import { DynamicIcon } from '../dynamic-icon';
import { CourseListing } from '@/app/lib/definitions/courses';
import { getColorClasses } from '@/app/lib/utils/color-classes';

interface Props {
  course: CourseListing;
  index: number;
}

export const CourseCardEnrolled = ({ course, index }: Props) => {
  const colorClasses = getColorClasses(course.theme_color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-xl ${colorClasses.bg} flex items-center justify-center flex-shrink-0`}>
          <DynamicIcon name={course.icon_name} className={`w-7 h-7 ${colorClasses.text}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-1">{course.name}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{course.description}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="bg-violet-50 text-violet-700 px-2 py-0.5 rounded font-medium">{course.category_name}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground font-medium">Progress</span>
          <span className="font-bold text-indigo-600">{course.progress_percent}%</span>
        </div>
        <p className="text-sm text-gray-600">{course.current_lesson || "Completed"}</p>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${course.progress_percent}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className={`h-full bg-gradient-to-r ${colorClasses.gradient} rounded-full`}
          />
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link
          href={`/dashboard/courses/${course.id}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Continue Learning</span>
        </Link>
      </motion.div>
    </motion.div>
  );
};