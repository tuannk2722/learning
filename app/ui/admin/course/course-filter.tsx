'use client';
import { Search } from 'lucide-react';

interface CourseFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedLevel: string;
  onLevelChange: (value: string) => void;
}

const levels = ["Beginner", "Intermediate", "Advanced"];

export function CourseFilter({
  searchQuery,
  onSearchChange,
  selectedLevel,
  onLevelChange,
}: CourseFilterProps) {

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div >
          <label className="block text-sm font-medium mb-2 text-slate-700">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700">
            Level
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => onLevelChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 appearance-none text-slate-700 font-medium"
          >
            <option value="All">All Levels</option>
            {levels.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}