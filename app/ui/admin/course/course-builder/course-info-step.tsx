"use client";

import { motion } from 'motion/react';
import { levels, iconOptions } from './course-types';
import { DynamicIcon } from '../../../dynamic-icon';
import { CoursePreview } from './preview-course';
import { useCourseBuilderStore } from './course-store';
import { COLOR_PALETTE } from '@/app/lib/utils/color-palette';

interface CourseInfoStepProps {
  onNext: () => void;
}

export default function CourseInfoStep({
  onNext
}: CourseInfoStepProps) {
  const { courseData, updateCourseData } = useCourseBuilderStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Info course */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Course Information</h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="courseName" className="block text-sm font-medium mb-2">Course Name *</label>
              <input
                id="courseName"
                type="text"
                placeholder="e.g., Advanced Calculus"
                value={courseData.name}
                onChange={(e) => updateCourseData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="courseDescription" className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                id="courseDescription"
                rows={4}
                placeholder="Describe what students will learn in this course..."
                value={courseData.description || ''}
                onChange={(e) => updateCourseData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="courseCategory" className="block text-sm font-medium mb-2">Category *</label>
                <input
                  id="courseCategory"
                  type='text'
                  placeholder='e.g., AI'
                  value={courseData.category_name || ''}
                  onChange={(e) => updateCourseData(prev => ({ ...prev, category_name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="courseLevel" className="block text-sm font-medium mb-2">Level *</label>
                <select
                  id="courseLevel"
                  value={courseData.level || ''}
                  onChange={(e) => updateCourseData(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Course Icon</label>
              <div className="grid grid-cols-10 gap-2">
                {iconOptions.map((iconItem) => (
                  <motion.button
                    key={iconItem.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateCourseData(prev => ({ ...prev, icon: iconItem.name }))}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-2 ${courseData.icon === iconItem.name ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                      }`}
                    type="button"
                  >
                    <DynamicIcon name={iconItem.name} className="w-6 h-6 text-gray-700" />
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Theme Color *
              </label>
              <div className="grid grid-cols-10 gap-2">
                {COLOR_PALETTE.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => updateCourseData(prev => ({ ...prev, theme_color: option.name }))}
                    className={`p-3 rounded-xl border-2 transition-all ${courseData.theme_color === option.name
                      ? "border-violet-500"
                      : "border-gray-200 hover:border-violet-300"
                      }`}
                    type="button"
                  >
                    <div className={`h-8 rounded-lg ${option.bg}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Next: Curriculum
            </motion.button>
          </div>
        </div>
      </div>

      {/* Preview course */}
      <CoursePreview />

    </motion.div>
  );
}
