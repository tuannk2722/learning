"use client";

import { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { CourseBuilderLesson, CourseBuilderSection } from '@/app/lib/definitions/lessons';
import { ConfirmModal } from '@/app/ui/modal-confirm';
import { CurriculumSectionItem } from './curriculum-section-item';
import { CurriculumSummary } from './curriculum-summary';

import { useCourseBuilderStore } from './course-store';

interface CurriculumStepProps {
  onBack: () => void;
  onNext: () => void;
}

export default function CurriculumStep({
  onBack,
  onNext
}: CurriculumStepProps) {
  const [sectionToDelete, setSectionToDelete] = useState<number | null>(null);

  const {
    courseData,
    updateCourseData,
    expandedCurriculum,
    setExpandedCurriculum,
    courseId,
    isDirty,
    toggleCurriculum,
  } = useCourseBuilderStore();

  const addCurriculum = () => {
    const newSection: CourseBuilderSection = {
      id: -Date.now(),
      title: 'New Section',
      lessons: []
    };

    updateCourseData(prev => {
      const newCurriculum = [...prev.sections, newSection];
      setExpandedCurriculum([...expandedCurriculum, newCurriculum.length - 1]);
      return { ...prev, sections: newCurriculum };
    });
  };

  const addLesson = (sectionIndex: number) => {
    const newLesson: CourseBuilderLesson = {
      id: -Date.now(),
      title: `Lesson ${courseData.sections[sectionIndex].lessons.length + 1}`,
      duration: 15,
      xp: 50
    };

    updateCourseData(prev => {
      const newCurriculum = prev.sections.map((section, idx) => {
        if (idx === sectionIndex) {
          return { ...section, lessons: [...section.lessons, newLesson] };
        }
        return section;
      });
      return { ...prev, sections: newCurriculum };
    });
  };

  const deleteSection = (index: number) => {
    updateCourseData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const deleteLesson = (sectionIndex: number, lessonId: string | number) => {
    updateCourseData(prev => {
      const newCurriculum = prev.sections.map((section, idx) => {
        if (idx === sectionIndex) {
          return {
            ...section,
            lessons: section.lessons.filter(l => l.id !== lessonId)
          };
        }
        return section;
      });
      return { ...prev, sections: newCurriculum };
    });
  };

  const updateSectionTitle = (currIndex: number, newTitle: string) => {
    updateCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((s, idx) =>
        idx === currIndex ? { ...s, title: newTitle } : s
      )
    }));
  };

  const reorderSections = (newSections: CourseBuilderSection[]) => {
    updateCourseData(prev => ({ ...prev, sections: newSections }));
  };

  const reorderLessons = (sectionIndex: number, newLessons: CourseBuilderLesson[]) => {
    updateCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((s, idx) =>
        idx === sectionIndex ? { ...s, lessons: newLessons } : s
      )
    }));
  };

  // Optimistic update: cập nhật status trong store sau khi publish/unpublish
  const handleLessonStatusChange = (lessonId: number, newStatus: string) => {
    updateCourseData(prev => ({
      ...prev,
      sections: prev.sections.map(section => ({
        ...section,
        lessons: section.lessons.map(lesson =>
          lesson.id === lessonId ? { ...lesson, status: newStatus } : lesson
        )
      }))
    }));
  };

  const totalLessons = courseData.sections.reduce(
    (sum, section) => sum + section.lessons.length,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Course Curriculum</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addCurriculum}
              className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </motion.button>
          </div>

          <div className="space-y-4">
            <Reorder.Group axis="y" values={courseData.sections} onReorder={reorderSections} className="space-y-4">
              {courseData.sections.map((section, currIndex) => (
                <Reorder.Item key={section.id} value={section}>
                  <CurriculumSectionItem
                    section={section}
                    currIndex={currIndex}
                    onUpdateTitle={updateSectionTitle}
                    onDeleteRequest={(idx) => {
                      if (courseId === null) {
                        deleteSection(idx);
                      } else {
                        setSectionToDelete(idx);
                      }
                    }}
                    onAddLesson={addLesson}
                    onDeleteLesson={deleteLesson}
                    onReorderLessons={reorderLessons}
                    onLessonStatusChange={handleLessonStatusChange}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>

          <div className="flex justify-between mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Next: Quiz
            </motion.button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          <CurriculumSummary
            totalSections={courseData.sections.length}
            totalLessons={totalLessons}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={sectionToDelete !== null}
        onClose={() => setSectionToDelete(null)}
        onConfirm={() => {
          if (sectionToDelete !== null) {
            deleteSection(sectionToDelete);
          }
        }}
        title="Delete Section"
        description="Are you sure you want to delete this section? All lessons inside this section will be permanently deleted. This action cannot be undone."
        okText="Delete Section"
        cancelText="Cancel"
        type="danger"
      />
    </motion.div>
  );
}
