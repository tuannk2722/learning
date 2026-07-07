'use client';
import { motion } from 'motion/react';

interface CourseData {
  name: string;
  enrollments: number;
  completionRate: number;
  rating: string;
}

export default function TopCourses({ data }: { data: CourseData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Top Performing Courses</h2>
        <span className="text-xs text-gray-400">Ranked by enrollments</span>
      </div>
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">#</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Course</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Enrollments</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Completion</th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Rating</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((course, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" :
                  i === 1 ? "bg-gray-200 text-gray-600" :
                    i === 2 ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"
                  }`}>
                  {i + 1}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-medium text-gray-900">{course.name}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-700">{course.enrollments.toLocaleString()}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                      style={{ width: `${course.completionRate}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-700">{course.completionRate}%</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1 text-sm text-gray-700">
                  <span className="text-amber-400">★</span>
                  {course.rating}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
