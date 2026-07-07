'use client';
import { useState, useEffect } from 'react';
import { CourseFilter } from './course-filter';
import { CourseRow } from './course-row';
import { CourseListing } from '@/app/lib/definitions/courses';
import { Pagination } from '../../pagination';

interface CourseListProps {
  initialCourses: CourseListing[];
}

export default function CourseList({ initialCourses }: CourseListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCourses = initialCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const ITEM_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredCourses.length / ITEM_PER_PAGE);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const safePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startPage = (safePage - 1) * ITEM_PER_PAGE;
  const currentCourses = filteredCourses.slice(startPage, startPage + ITEM_PER_PAGE)

  return (
    <>
      <CourseFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
      />

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
              {currentCourses.map((course, index) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex justify-center bg-slate-50/30">
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}