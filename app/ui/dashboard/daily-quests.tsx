'use client';

import { CheckCircle2, Target } from "lucide-react";
import { motion } from "motion/react";

const dailyQuests = [
  { id: 1, title: "Complete 3 lessons", progress: 2, total: 3, xp: 500, completed: false },
  { id: 2, title: "Solve 5 coding problems", progress: 5, total: 5, xp: 750, completed: true },
  { id: 3, title: "Study continuously for 30 minutes", progress: 25, total: 30, xp: 300, completed: false },
];

export function DailyQuests() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Daily Quests</h2>
            <p className="text-sm text-gray-600">Complete to earn bonus XP!</p>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {dailyQuests.filter(q => q.completed).length}/{dailyQuests.length} completed
        </div>
      </div>

      <div className="space-y-4">
        {dailyQuests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            className={`p-4 rounded-2xl border-2 transition-all ${quest.completed
              ? "bg-emerald-50 border-emerald-200"
              : "bg-gray-50 border-gray-200 hover:border-violet-300"
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {quest.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                )}
                <div>
                  <div className="font-bold text-gray-900">{quest.title}</div>
                  <div className="text-sm text-gray-600">+{quest.xp} XP</div>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-700">
                {quest.progress}/{quest.total}
              </div>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-full ${quest.completed ? "bg-emerald-500" : "bg-violet-500"
                  }`}
                style={{ width: `${(quest.progress / quest.total) * 100}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}