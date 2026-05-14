'use client';

import { motion } from 'motion/react';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';

interface QuizHeaderProps {
  courseId: string;
  lessonId: string;
  onSave: () => void;
}

export default function QuizHeader({ courseId, lessonId, onSave }: QuizHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link href={`/admin/courses/${courseId}/lessons/${lessonId}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Quiz Builder</h1>
          <p className="text-muted-foreground">Create interactive assessments</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Preview
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSave}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Quiz
        </motion.button>
      </div>
    </div>
  );
}
