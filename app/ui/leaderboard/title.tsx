'use client';

import { Crown } from "lucide-react";
import { motion } from "motion/react";

export function LeaderboardTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-20 mb-10"
    >
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <Crown className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-3xl font-semibold">
              Leaderboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Compete with learners worldwide
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}