"use client";

import { motion } from 'motion/react';
import { Category } from '@/app/lib/definitions/courses';
import { levels, iconOptions, colorOptions } from './course-builder/course-types';
import { DynamicIcon } from '../../dynamic-icon';
import { CourseBuilderResult } from '@/app/lib/definitions/lessons';

interface CourseInfoStepProps {
  courseData: CourseBuilderResult;
  setCourseData: React.Dispatch<React.SetStateAction<CourseBuilderResult>>;
  categories: Category[];
  onNext: () => void;
}

export default function CourseInfoStep({
  courseData,
  setCourseData,
  categories,
  onNext
}: CourseInfoStepProps) {
  const text_color = colorOptions.find(c => c.bg === courseData.theme_color)?.text;

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
                onChange={(e) => setCourseData(prev => ({ ...prev, name: e.target.value }))}
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
                onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="courseCategory" className="block text-sm font-medium mb-2">Category *</label>
                <select
                  id="courseCategory"
                  value={courseData.category_id || ''}
                  onChange={(e) => setCourseData(prev => ({ ...prev, category_id: e.target.value ? Number(e.target.value) : null }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="courseLevel" className="block text-sm font-medium mb-2">Level *</label>
                <select
                  id="courseLevel"
                  value={courseData.level || ''}
                  onChange={(e) => setCourseData(prev => ({ ...prev, level: e.target.value }))}
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
                    onClick={() => setCourseData(prev => ({ ...prev, icon: iconItem.name }))}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-2 ${courseData.icon === iconItem.name ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                      }`}
                    type="button"
                  >
                    {/* <iconItem.icon className="w-6 h-6 text-gray-700" /> */}
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
                {colorOptions.map((option) => (
                  <button
                    key={option.bg}
                    onClick={() => setCourseData(prev => ({ ...prev, theme_color: option.bg, text_color: option.text }))}
                    className={`p-3 rounded-xl border-2 transition-all ${courseData.theme_color === option.bg
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
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Live Preview</div>
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-2xl shadow-indigo-100/50 group transition-all hover:shadow-indigo-200/50 hover:-translate-y-1">
            <div className={`w-20 h-20 ${courseData.theme_color} rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-200/20 group-hover:scale-110 transition-transform duration-500`}>
              {courseData.icon && (() => {
                // const Icon = iconOptions.find(i => i.name === courseData.icon)?.icon;
                return <DynamicIcon name={courseData.icon} className={`w-10 h-10 ${text_color}`} />;
              })()}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-400">
                {categories.find(c => c.id === courseData.category_id)?.name || "Category"}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${courseData.theme_color} ${text_color} border border-gray-50`}>
                {courseData.level}
              </span>
            </div>

            <div className="space-y-3 mb-8">
              <h4 className="text-2xl font-black text-gray-900 leading-tight">
                {courseData.name || "Course Name"}
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                {courseData.description || "Course description will appear here..."}
              </p>
            </div>

            <div className="pt-8 border-t border-gray-50">
              <button className={`w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:brightness-95 transition-all active:scale-[0.98]`}>
                Start Learning
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
