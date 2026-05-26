"use client";

import { motion } from 'motion/react';
import { Trash2, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { CourseBuilderLesson } from '@/app/lib/definitions/lessons';
import { Popconfirm } from '@/app/ui/pop-confirm';

import { useCourseBuilderStore } from './course-store';

interface CurriculumLessonItemProps {
  lesson: CourseBuilderLesson;
  sectionIndex: number;
  onDeleteLesson: (sectionIndex: number, lessonId: string | number) => void;
}

export function CurriculumLessonItem({
  lesson,
  sectionIndex,
  onDeleteLesson
}: CurriculumLessonItemProps) {
  const { courseId, isDirty } = useCourseBuilderStore();
  const canEditLesson = courseId !== null && !isDirty;
  return (
    <div
      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all group"
    >
      <GripVertical className="w-4 h-4 text-gray-300 cursor-grab active:cursor-grabbing flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-gray-900 truncate">{lesson.title}</div>
        <div className="text-xs font-bold text-slate-400 uppercase mt-1">
          {lesson.duration} min • {lesson.xp} XP
        </div>
      </div>
      <div className="flex items-center gap-2">
        {canEditLesson ? (
          <Link href={`/admin/courses/${courseId}/lessons/${lesson.id}`}>
            <button className="px-3 py-1.5 text-xs font-bold border border-gray-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors uppercase tracking-wider">
              Edit
            </button>
          </Link>
        ) : (
          <button 
            className="px-3 py-1.5 text-[10px] font-bold text-gray-400 border border-gray-100 rounded-lg uppercase tracking-wider bg-gray-50 cursor-not-allowed"
            title={isDirty ? "Save changes first" : "Save course first"}
            disabled
          >
            {isDirty ? "Save to Edit" : "Unsaved Course"}
          </button>
        )}

        {courseId === null ? (
          <button 
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group/trash" 
            onClick={() => onDeleteLesson(sectionIndex, lesson.id)}
          >
            <Trash2 className="w-4 h-4 text-red-400 group-hover/trash:text-red-600" />
          </button>
        ) : (
          <Popconfirm
            title="Delete Lesson"
            description="Are you sure you want to delete this lesson?"
            onConfirm={() => onDeleteLesson(sectionIndex, lesson.id)}
            okText="Yes"
            cancelText="No"
          >
            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group/trash">
              <Trash2 className="w-4 h-4 text-red-400 group-hover/trash:text-red-600" />
            </button>
          </Popconfirm>
        )}
      </div>
    </div>
  );
}
