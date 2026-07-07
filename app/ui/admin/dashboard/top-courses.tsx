'use client';
import { motion } from 'motion/react';

interface CourseData {
  name: string;
  enrollments: number;
  completion: number;
  color: string;
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
        {data.map((course, index) => (
          <motion.div
            key={course.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
          >
            <div className="flex-1">
              <h3 className="font-medium mb-1">{course.name}</h3>
              <p className="text-sm text-muted-foreground">{course.enrollments.toLocaleString()} enrollments</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{course.completion}%</div>
              <div className="text-xs text-muted-foreground">completion</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
