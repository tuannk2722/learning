'use client';
import { motion } from 'motion/react';
import { DynamicIcon } from '../../dynamic-icon';

interface CourseStatsProps {
  totalCourses: number;
  published: number;
  draft: number;
  totalEnrollments: number;
}

export default function CourseStats({ totalCourses, published, draft, totalEnrollments }: CourseStatsProps) {
  const stats = [
    { label: 'Total Courses', value: totalCourses, icon: "book-open", color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Published', value: published, icon: "book-open", color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Draft', value: draft, icon: "book-open", color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Total Enrollments', value: totalEnrollments, icon: "users", color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <DynamicIcon name={stat.icon} className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-muted-foreground text-sm font-medium">{stat.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
