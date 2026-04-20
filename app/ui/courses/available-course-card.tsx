'use client';

import { motion } from 'motion/react';
import { Star, Users } from 'lucide-react';
import { Course } from '@/app/lib/definitions/definitions';
import { DynamicIcon } from '../dynamic-icon';
import Link from 'next/link';

interface Props {
  course: Course;
  index: number;
}

export const CourseCardAvailable = ({ course, index }: Props) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col h-full"
    >
      <div className={`w-14 h-14 rounded-xl ${course.color || 'bg-violet-100'} flex items-center justify-center mb-4`}>
        <DynamicIcon name={course.icon} className={`w-7 h-7 ${course.iconColor}`} />
      </div>

      <h3 className="text-lg font-medium mb-2">{course.name}</h3>
      <p className="text-sm text-muted-foreground mb-4 flex-grow">{course.description}</p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <span className="bg-gray-100 px-2 py-1 rounded">{course.level}</span>
        <span>{course.lessons || 0} lessons</span>
        <span>{course.duration} hours</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-sm">{course.rating}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Users className="w-4 h-4" />
          <span suppressHydrationWarning>{course.students.toLocaleString('en-US')}</span>
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link
          href={`/dashboard/courses/${course.id}/`}
          className="w-full inline-flex items-center justify-center border-2 border-indigo-600 text-indigo-600 px-4 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Enroll Now
        </Link>
      </motion.div>
    </motion.div>
  );
};
