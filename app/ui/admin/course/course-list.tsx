'use client';
import { useState } from 'react';
import { Course } from '@/app/lib/definitions/definitions';
import { CourseFilter } from './course-filter';
import { CourseRow } from './course-row';
import { CoursePagination } from './course-pagination';

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
      <CourseFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />

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
                <CourseRow key={course.id} course={course} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CoursePagination filteredItems={filteredCourses.length} totalItems={initialCourses.length} />
    </>
  );
}