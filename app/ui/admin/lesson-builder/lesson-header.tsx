'use client';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/app/ui/modal-confirm';
import { useRouter } from 'next/navigation';

interface LessonHeaderProps {
  courseId: string;
  onSave: () => void;
  onPreview: () => void;
  isSaving?: boolean;
  isDirty?: boolean;
}

export default function LessonHeader({ courseId, onSave, onPreview, isSaving = false, isDirty = false }: LessonHeaderProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleBack = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      router.push(`/admin/courses/${courseId}`);
    }
  }

  return (
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Lesson Builder
          </h1>
          <p className="text-muted-foreground">Create engaging lesson content</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isDirty && (
          <span className="flex items-center gap-1.5 text-amber-600 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Unsaved changes
          </span>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPreview}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium"
        >
          <Eye className="w-4 h-4" />
          Preview
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className={`px-6 py-2 text-white rounded-lg flex items-center gap-2 transition-colors ${isDirty ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed opacity-70"}`}
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Lesson'}
        </motion.button>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => router.push(`/admin/courses/${courseId}`)}
        title='Unsaved changes'
        description='You have unsaved changes. Are you sure you want to leave?'
        okText='Yes'
        cancelText='No'
        type='danger'
      />
    </div>
  );
}
