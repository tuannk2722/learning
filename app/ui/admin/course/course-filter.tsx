'use client';
import { Search } from 'lucide-react';
import { Category } from '@/app/lib/definitions/courses';

interface CourseFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedLevel: string;
  onLevelChange: (value: string) => void;
  categories: Category[];
}

const levels = ["Beginner", "Intermediate", "Advanced"];

export function CourseFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLevel,
  onLevelChange,
  categories
}: CourseFilterProps) {
  const handleRefresh = () => {
    onSearchChange('');
    onCategoryChange('All');
    onLevelChange('All');
  }

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
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="flex-1 md:w-auto px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all font-medium bg-white hover:border-blue-600"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <select
            value={selectedLevel}
            onChange={(e) => onLevelChange(e.target.value)}
            className="flex-1 md:w-auto px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all font-medium bg-white hover:border-blue-600"
          >
            <option value="All">All Levels</option>
            {levels.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <button
            onClick={handleRefresh}
            className="flex-1 md:w-auto px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all font-medium bg-white hover:border-blue-600"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}