'use client';
import { BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export function LessonNote() {

  return (
    <div className='max-w-4xl mx-auto px-6 pb-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 bg-yellow-50 rounded-3xl p-8 border-2 border-yellow-200"
      >
        <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-yellow-600" />
          Take a note
        </h4>
        <textarea
          placeholder="Viết ghi chú cho bài học này..."
          className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:border-yellow-400 focus:outline-none resize-none bg-white"
          rows={4}
        />
        <button className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors font-medium">
          Save note
        </button>
      </motion.div>
    </div>
  )
}