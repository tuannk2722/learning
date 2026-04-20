'use client';
import { motion } from "motion/react";

export function AchievementProgressBar({
  unlockedCount,
  totalAchievements
}: {
  unlockedCount: number,
  totalAchievements: number,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8"
    >
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium">Overall Progress</span>
        <span className="text-sm text-muted-foreground">
          {Math.round((unlockedCount / totalAchievements) * 100)}%
        </span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(unlockedCount / totalAchievements) * 100}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
        />
      </div>
    </motion.div>
  )
}