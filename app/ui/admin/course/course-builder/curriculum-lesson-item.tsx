"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { Trash2, GripVertical, Globe, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { CourseBuilderLesson } from '@/app/lib/definitions/lessons';
import { Popconfirm } from '@/app/ui/pop-confirm';
import { toast } from 'sonner';

import { useCourseBuilderStore } from './course-store';
import { publishLesson, unpublishLesson } from '@/app/lib/actions/lesson';

interface CurriculumLessonItemProps {
  lesson: CourseBuilderLesson;
  sectionIndex: number;
  onDeleteLesson: (sectionIndex: number, lessonId: string | number) => void;
  onStatusChange?: (lessonId: number, newStatus: string) => void;
}

export function CurriculumLessonItem({
  lesson,
  sectionIndex,
  onDeleteLesson,
  onStatusChange,
}: CurriculumLessonItemProps) {
  const { courseId, isDirty } = useCourseBuilderStore();
  const [isToggling, setIsToggling] = useState(false);

  // Lesson mới chưa lưu (id âm) thì coi như draft, chưa có nút publish
  const isNewLesson = lesson.id < 0;
  const isPublished = lesson.status === 'published';
  const canEditLesson = courseId !== null && !isDirty;

  const handleTogglePublish = async () => {
    if (isToggling || isNewLesson) return;
    setIsToggling(true);
    try {
      const result = isPublished
        ? await unpublishLesson(lesson.id)
        : await publishLesson(lesson.id);

      if (!result.success) throw new Error(result.error);

      const newStatus = isPublished ? 'draft' : 'published';
      onStatusChange?.(lesson.id, newStatus);
      toast.success(isPublished ? 'Lesson unpublished' : 'Lesson published!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update lesson status');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all group">
      <GripVertical className="w-4 h-4 text-gray-300 cursor-grab active:cursor-grabbing flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="font-bold text-gray-900 truncate">{lesson.title}</div>
        <div className="text-xs font-bold text-slate-400 uppercase mt-1">
          {lesson.duration} min • {lesson.xp} XP
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Badge + Toggle Publish — chỉ hiện với lesson đã được lưu vào DB */}
        {!isNewLesson && (
          <motion.button
            whileHover={!isDirty ? { scale: 1.04 } : {}}
            whileTap={!isDirty ? { scale: 0.96 } : {}}
            onClick={!isDirty ? handleTogglePublish : undefined}
            disabled={isDirty || isToggling}
            title={
              isDirty
                ? 'Save changes first before changing publish status'
                : isPublished
                  ? 'Click to unpublish'
                  : 'Click to publish this lesson'
            }
            className={`
              flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border
              ${isDirty
                ? 'cursor-not-allowed opacity-50 bg-gray-50 text-gray-400 border-gray-100'
                : isPublished
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                  : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 cursor-pointer'
              }
              ${isToggling ? 'opacity-60 cursor-wait' : ''}
            `}
          >
            {isToggling ? (
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : isPublished ? (
              <Globe className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
            {isToggling ? '...' : isPublished ? 'Published' : 'Draft'}
          </motion.button>
        )}

        {/* Nút Edit Lesson */}
        {canEditLesson && !isNewLesson ? (
          <Link href={`/admin/courses/${courseId}/lessons/${lesson.id}`}>
            <button className="px-3 py-1.5 text-xs font-bold border border-gray-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors uppercase tracking-wider">
              Edit
            </button>
          </Link>
        ) : (
          <button
            className="px-3 py-1.5 text-[10px] font-bold text-gray-400 border border-gray-100 rounded-lg uppercase tracking-wider bg-gray-50 cursor-not-allowed"
            title={isDirty ? 'Save changes first' : 'Save course first'}
            disabled
          >
            {isDirty ? 'Save to Edit' : isNewLesson ? 'Unsaved' : 'Unsaved Course'}
          </button>
        )}

        {/* Nút Delete */}
        {courseId === null || isNewLesson ? (
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
