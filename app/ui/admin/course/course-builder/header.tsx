"use client";

import { ArrowLeft, Save, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useState } from 'react';
import { ConfirmModal } from '@/app/ui/modal-confirm';

import { useCourseBuilderStore } from './course-store';

interface HeaderProps {
  onSave: () => void;
}

export default function Header({ onSave }: HeaderProps) {
  const { courseId, isSaving, isDirty, revertAll } = useCourseBuilderStore();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRevertConfirm, setShowRevertConfirm] = useState(false);

  const handleBack = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      router.push('/admin/courses');
    }
  };

  return (
    <>
      {isSaving && (
        <div className="fixed inset-0 z-[99999] bg-white/10 backdrop-blur-sm cursor-wait" />
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold">{courseId === null ? "Create New Course" : "Edit Course"}</h1>
            <p className="text-muted-foreground">
              {courseId === null ? "Build engaging learning experiences" : "Update course content and quizzes"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isDirty && (
            <span className="flex items-center gap-1.5 text-amber-600 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved changes
            </span>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRevertConfirm(true)}
            disabled={!isDirty || isSaving}
            className={`p-2 rounded-lg flex items-center justify-center transition-colors ${isDirty && !isSaving
              ? 'text-red-600 bg-red-50 hover:bg-red-100'
              : 'text-gray-400 bg-gray-50 cursor-not-allowed opacity-70'
              }`}
            title="Revert all changes"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSave}
            disabled={!isDirty || isSaving}
            className={`px-6 py-2 text-white rounded-lg flex items-center gap-2 transition-colors ${isDirty ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed opacity-70"
              }`}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>

        <ConfirmModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => router.push('/admin/courses')}
          title="Unsaved Changes"
          description="You have unsaved changes. Are you sure you want to leave? All your progress will be lost."
          okText="Leave Page"
          cancelText="Stay"
          type="danger"
        />

        <ConfirmModal
          isOpen={showRevertConfirm}
          onClose={() => setShowRevertConfirm(false)}
          onConfirm={() => {
            revertAll();
            setShowRevertConfirm(false);
          }}
          title="Revert All Changes"
          description="Are you sure you want to revert all changes? This will restore the course to its last saved state and cannot be undone."
          okText="Revert All"
          cancelText="Cancel"
          type="warning"
        />
      </div>
    </>
  );
}
