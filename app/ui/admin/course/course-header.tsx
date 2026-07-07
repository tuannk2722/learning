'use client';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function CourseHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-4xl text-transparent font-bold">
            Course Management
          </h1>
          <p className="text-muted-foreground font-medium">
            Create and manage learning content
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            href="/admin/courses/create"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 font-semibold"
          >
            <Plus className="h-5 w-5" />
            <span>Create Course</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
