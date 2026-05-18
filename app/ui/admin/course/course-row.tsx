// components/course-list/course-row.tsx
'use client';
import { motion } from 'motion/react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { CourseListing } from '@/app/lib/definitions/courses';

interface CourseRowProps {
  course: CourseListing;
  index: number;
}

export function CourseRow({ course, index }: CourseRowProps) {
  const handleDelete = () => {
    if (window.confirm(`Delete "${course.name}"?`)) {
      console.log('Delete course:', course.id);
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      className="hover:bg-slate-50 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="font-bold text-gray-900">{course.name}</div>
          <div className="text-sm text-gray-500 font-medium">{course.category_name}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-700">{course.total_lessons} lessons</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gray-200`}>
          {course.level}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-bold text-gray-900">{course.enrolled_count.toLocaleString()}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${course.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
          {course.status.toUpperCase()}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <Link href={`/admin/courses/${course.id}`}>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-slate-100 rounded-lg group">
              <Eye className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
            </motion.button>
          </Link>
          <Link href={`/admin/courses/${course.id}`}>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-blue-50 rounded-lg group">
              <Edit2 className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
            </motion.button>
          </Link>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 hover:bg-red-50 rounded-lg group" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 text-red-600 group-hover:text-red-700" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
}