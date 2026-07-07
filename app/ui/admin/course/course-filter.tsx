'use client';
import { Search } from 'lucide-react';

interface CourseFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function CourseFilter({ searchQuery, onSearchChange }: CourseFilterProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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
  );
}