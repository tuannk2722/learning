"use client";

import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight, Video, Code, FileText, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { CourseBuilderResult } from '@/app/lib/definitions/lessons';

interface CurriculumStepProps {
  isNew: boolean;
  courseId: string;
  courseData: CourseBuilderResult;
  expandedCurriculum: number[];
  totalLessons: number;
  onToggleCurriculum: (index: number) => void;
  onAddCurriculum: () => void;
  onAddLesson: (sectionIndex: number) => void;
  onDeleteSection: (index: number) => void;
  onDeleteLesson: (sectionIndex: number, lessonId: string | number) => void;
  onUpdateSectionTitle: (currIndex: number, newTitle: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function CurriculumStep({
  isNew,
  courseId,
  courseData,
  expandedCurriculum,
  totalLessons,
  onToggleCurriculum,
  onAddCurriculum,
  onAddLesson,
  onDeleteSection,
  onDeleteLesson,
  onUpdateSectionTitle,
  onBack,
  onNext
}: CurriculumStepProps) {
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
              onClick={onAddCurriculum}
              className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </motion.button>
          </div>

          {isNew && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-amber-800 text-sm">
              <div className="mt-0.5"><HelpCircle className="w-4 h-4" /></div>
              <div>
                <strong>Draft Mode:</strong> Build your curriculum outline here. You must <strong>Save Course</strong> first before you can edit individual lesson content or quizzes.
              </div>
            </div>
          )}

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {courseData.sections.map((section, currIndex) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                >
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors border-b border-gray-100"
                    onClick={() => onToggleCurriculum(currIndex)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      {expandedCurriculum.includes(currIndex) ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                      <input
                        type="text"
                        value={section.title}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onUpdateSectionTitle(currIndex, e.target.value)}
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
                          onDeleteSection(currIndex);
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        aria-label="Delete Section"
                      >
                        <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                      </button>
                    </div>
                  </div>

                  {expandedCurriculum.includes(currIndex) && (
                    <div className="p-4 space-y-3 bg-slate-50/30">
                      <AnimatePresence mode="popLayout">
                        {section.lessons.map((lesson) => (
                          <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all group"
                          >
                            <GripVertical className="w-4 h-4 text-gray-300" />
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-50">
                              {lesson.type === 'video' ? (
                                <Video className="w-5 h-5 text-red-500" />
                              ) : (
                                <FileText className="w-5 h-5 text-blue-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-gray-900 truncate">{lesson.title}</div>
                              <div className="text-xs font-bold text-slate-400 uppercase mt-1">
                                {lesson.type} • {lesson.duration} min • {lesson.xp} XP
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isNew ? (
                                <span className="px-3 py-1.5 text-[10px] font-bold text-gray-400 border border-gray-100 rounded-lg uppercase tracking-wider bg-gray-50 cursor-not-allowed">
                                  Save to Edit
                                </span>
                              ) : (
                                <Link href={`/admin/courses/${courseId}/lessons/${lesson.id}`}>
                                  <button className="px-3 py-1.5 text-xs font-bold border border-gray-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors uppercase tracking-wider">
                                    Edit
                                  </button>
                                </Link>
                              )}

                              <button
                                onClick={() => onDeleteLesson(currIndex, lesson.id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors group/trash"
                                aria-label="Delete Lesson"
                              >
                                <Trash2 className="w-4 h-4 text-red-400 group-hover/trash:text-red-600" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

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
                </motion.div>
              ))}
            </AnimatePresence>
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
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 ml-2">Course Summary</h3>

            <div className="space-y-4">
              <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100 transition-all hover:shadow-md">
                <div className="text-[10px] font-bold text-violet-600 uppercase tracking-tight mb-1">Total Sections</div>
                <div className="text-3xl font-black text-violet-900">{courseData.sections.length}</div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 transition-all hover:shadow-md">
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-tight mb-1">Total Lessons</div>
                <div className="text-3xl font-black text-blue-900">{totalLessons}</div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 transition-all hover:shadow-md">
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight mb-1">Estimated Duration</div>
                <div className="text-3xl font-black text-emerald-900">
                  {Math.floor(totalLessons * 15 / 60)}h {(totalLessons * 15) % 60}m
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 bg-slate-900 rounded-2xl shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-start gap-3 relative z-10">
                <div className="text-xl">💡</div>
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 tracking-widest">Builder Tip</div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                    Group related lessons into logical sections to help students navigate their learning journey more effectively.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
