'use client';

import { motion } from 'motion/react';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmModal } from '@/app/ui/modal-confirm';

interface QuizHeaderProps {
  courseId: string;
  lessonId: string;
  onSave: () => void;
  onPreview: () => void;
  isSaving: boolean;
  isDirty: boolean;
}

export default function QuizHeader({
  courseId,
  lessonId,
  onSave,
  onPreview,
  isSaving,
  isDirty,
}: QuizHeaderProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleBack = () => {
    if (isDirty) {
      setShowModal(true);
    } else {
      router.push(`/admin/courses/${courseId}`);
    }
  }

  return (
    <>
      {isSaving &&
        <div className="fixed inset-0 z-[9998] bg-white/10 backdrop-blur-sm cursor-wait" />
      }

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-slate-100 rounded-lg"
            onClick={handleBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold">Quiz Builder</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              Create interactive assessments
            </p>
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
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            Preview
          </motion.button>
          <motion.button
            whileHover={!isSaving && isDirty ? { scale: 1.05 } : {}}
            whileTap={!isSaving && isDirty ? { scale: 0.95 } : {}}
            disabled={isSaving || !isDirty}
            onClick={onSave}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${isSaving || !isDirty
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm border border-indigo-600'
              }`}
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Quiz'}
          </motion.button>
        </div>

        <ConfirmModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => router.push(`/admin/courses/${courseId}`)}
          title='Unsaved changes'
          description='You have unsaved changes. Are you sure you want to leave?'
          okText='Yes'
          cancelText='No'
          type='danger'
        />
      </div>
    </>
  );
}
