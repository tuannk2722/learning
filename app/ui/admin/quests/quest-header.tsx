'use client';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

export default function QuestHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent font-bold">
            Quest System
          </h1>
          <p className="text-muted-foreground">Manage daily, weekly and special quests</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm font-semibold transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Quest
        </motion.button>
      </div>
    </motion.div>
  );
}
