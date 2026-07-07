'use client';
import { motion } from 'motion/react';
import { DynamicIcon } from '../../dynamic-icon';
import { getColorClasses } from '@/app/lib/utils/color-palette';

interface CourseData {
  name: string;
  enrollments: number;
  iconName: string;
  themeColor: string;
}

export default function TopCourses({ data }: { data: CourseData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-6">Top Performing Courses</h2>

      <div className="space-y-4">
        {data.map((course, index) => {
          const { gradient } = getColorClasses(course.themeColor);

          return (
            <motion.div
              key={course.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                  <DynamicIcon name={course.iconName} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{course.name}</h3>
                  <p className="text-sm text-muted-foreground">{course.enrollments.toLocaleString()} enrollments</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  );
}
