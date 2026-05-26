"use client";

import { motion, Reorder, AnimatePresence } from 'motion/react';
import { Plus, Trash2, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { CourseBuilderSection, CourseBuilderLesson } from '@/app/lib/definitions/lessons';
import { CurriculumLessonItem } from './curriculum-lesson-item';

import { useCourseBuilderStore } from './course-store';

interface CurriculumSectionItemProps {
  section: CourseBuilderSection;
  currIndex: number;
  onUpdateTitle: (index: number, title: string) => void;
  onDeleteRequest: (index: number) => void;
  onAddLesson: (index: number) => void;
  onDeleteLesson: (sectionIndex: number, lessonId: string | number) => void;
  onReorderLessons: (sectionIndex: number, newLessons: CourseBuilderLesson[]) => void;
}

export function CurriculumSectionItem({
  section,
  currIndex,
  onUpdateTitle,
  onDeleteRequest,
  onAddLesson,
  onDeleteLesson,
  onReorderLessons
}: CurriculumSectionItemProps) {
  const { expandedCurriculum, toggleCurriculum } = useCourseBuilderStore();
  const isExpanded = expandedCurriculum.includes(currIndex);
  const onToggle = toggleCurriculum;

  return (
    <div
      className="border border-gray-200 rounded-xl overflow-hidden bg-white"
    >
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors border-b border-gray-100"
        onClick={() => onToggle(currIndex)}
      >
        <GripVertical className="w-5 h-5 text-gray-300 cursor-grab active:cursor-grabbing flex-shrink-0" />
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          )}
          <input
            type="text"
            value={section.title}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onUpdateTitle(currIndex, e.target.value)}
            className="font-bold text-gray-900 bg-transparent px-2 py-1 rounded hover:bg-white border border-transparent hover:border-gray-200 focus:outline-none focus:border-indigo-500 w-full"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
            {section.lessons.length} items
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRequest(currIndex);
            }}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
            aria-label="Delete Section"
          >
            <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-600" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3 bg-slate-50/30">
          <Reorder.Group
            axis="y"
            values={section.lessons}
            onReorder={(newLessons) => onReorderLessons(currIndex, newLessons)}
            className="space-y-3"
          >
            {section.lessons.map((lesson) => (
              <Reorder.Item key={lesson.id} value={lesson}>
                <CurriculumLessonItem
                  lesson={lesson}
                  sectionIndex={currIndex}
                  onDeleteLesson={onDeleteLesson}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: '#F8FAFC' }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onAddLesson(currIndex)}
            className="w-full p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-white text-sm font-bold text-slate-400 hover:text-indigo-600 flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            ADD LESSON
          </motion.button>
        </div>
      )}
    </div>
  );
}
