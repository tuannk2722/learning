'use client';
import { motion } from 'motion/react';
import { Search, Eye, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface Course {
  id: number;
  title: string;
  category: string;
  lessons: number;
  level: string;
  students: number;
  status: string;
  bgGradient: string;
}

interface CourseListProps {
  initialCourses: Course[];
}

export default function CourseList({ initialCourses }: CourseListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = initialCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
            />
          </div>
          <div className="flex w-full md:w-auto gap-4">
            <select className="flex-1 md:w-auto px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all font-medium">
              <option>All Categories</option>
              <option>Programming</option>
              <option>Web Development</option>
              <option>AI & ML</option>
            </select>
            <select className="flex-1 md:w-auto px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all font-medium">
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Content</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Enrollments</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.map((course, index) => (
                <motion.tr
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-bold text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-500 font-medium">{course.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-700">
                      <div>{course.lessons} lessons</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${course.bgGradient}`}>
                      {course.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900">{course.students.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${course.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {course.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/courses/${course.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-slate-100 rounded-lg group"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                        </motion.button>
                      </Link>
                      <Link href={`/admin/courses/create?courseId=${course.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-blue-50 rounded-lg group"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-red-50 rounded-lg group"
                        title="Delete"
                        onClick={() => {
                          if (window.confirm(`Delete "${course.title}"?`)) {
                            // TODO: gọi API xóa
                            console.log('Delete course:', course.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-500 font-medium">
          Showing {filteredCourses.length} of {initialCourses.length} courses
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-bold text-gray-600">
            Previous
          </button>
          <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all text-sm font-bold shadow-md shadow-violet-100">
            1
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-bold text-gray-600">
            2
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-bold text-gray-600">
            Next
          </button>
        </div>
      </div>
    </>
  );
}
