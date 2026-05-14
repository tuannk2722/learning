'use client';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import Link from 'next/link';

interface LessonHeaderProps {
  onSave: () => void;
  onPreview: () => void;
}

export default function LessonHeader({ onSave, onPreview }: LessonHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/course/create">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </motion.button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Lesson Builder
          </h1>
          <p className="text-muted-foreground">Create engaging lesson content</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
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
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-semibold shadow-lg shadow-indigo-100"
        >
          <Save className="w-4 h-4" />
          Save Lesson
        </motion.button>
      </div>
    </div>
  );
}
