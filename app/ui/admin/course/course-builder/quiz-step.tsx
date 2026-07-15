"use client";

import { motion } from 'motion/react';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';

import { useCourseBuilderStore } from './course-store';
import { useState } from 'react';
import { ConfirmModal } from '@/app/ui/modal-confirm';

interface QuizStepProps {
  onBack: () => void;
  onPublish: () => void;
  withdraw: () => void;
}

export default function QuizStep({
  onBack,
  onPublish,
  withdraw
}: QuizStepProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const { courseId, isDirty, courseData, isSaving } = useCourseBuilderStore();

  const isPublished = courseData.status === 'published';
  const isDisabled = isSaving || isDirty;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto w-full"
    >
      <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <HelpCircle className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Lesson Quizzes</h2>
          <p className="text-gray-500 font-medium">Configure assessments to validate student progress</p>
        </div>

        {courseData.sections.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-3xl bg-slate-50/50">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6">No sections or lessons found</p>
            <button
              onClick={onBack}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Return to Curriculum
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {courseData.sections.map((section) => (
              <div key={section.id} className="bg-slate-50/50 border border-gray-100 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    {section.title}
                  </h3>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{section.lessons.length} lessons</span>
                </div>
                <div className="grid gap-3">
                  {section.lessons.map((lesson, index) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl group transition-all hover:border-indigo-200 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{lesson.title}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lesson {index + 1}</span>
                        </div>
                      </div>

                      {courseId !== null && !isDirty ? (
                        <Link
                          href={`/admin/courses/${courseData.id}/lessons/${lesson.id}/quiz`}
                          className="px-6 py-2 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          Edit Quiz
                        </Link>
                      ) : (
                        <button
                          className="px-6 py-2 bg-gray-100 border border-gray-200 text-gray-400 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-not-allowed"
                          title={isDirty ? "Save changes first" : "Save course first"}
                          disabled
                        >
                          {isDirty ? "Save to Edit" : "Save to Create Quiz"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
          <div className="flex items-start gap-4">
            <div className="text-2xl">💡</div>
            <div>
              <div className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2">Pro Tips</div>
              <ul className="text-xs text-indigo-700 space-y-1 font-medium">
                <li>• Each lesson should have at least one quiz to validate learning.</li>
                <li>• Mix different question types to keep students engaged.</li>
                <li>• Set appropriate XP rewards based on the difficulty of the quiz.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
          <button
            onClick={onBack}
            className="px-8 py-3 border-2 border-gray-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-gray-500 uppercase tracking-widest text-xs"
          >
            Previous
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isDisabled}
            className={`px-10 py-4 text-white rounded-2xl font-bold transition-all uppercase tracking-widest text-xs ${isDisabled
              ? "bg-gray-300 cursor-not-allowed opacity-70"
              : "bg-gradient-to-r from-indigo-600 to-violet-700 hover:shadow-2xl hover:shadow-indigo-500/40"
              }`}
          >
            {isSaving ? "Saving..." : !isPublished ? "Publish Course" : "Unpublish Course"}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          if (isPublished) {
            withdraw();
          } else {
            onPublish();
          }
        }}
        title={isPublished ? "Unpublish Course" : "Publish Course"}
        description={
          isPublished
            ? "Are you sure you want to unpublish this course?"
            : "Are you sure you want to publish this course? Make sure you have added all lessons and quizzes!"
        }
        type="info"
      />
    </motion.div>
  );
}
