'use client';

import { TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { LeaderboardEntry } from "@/app/lib/definitions/definitions";

type LeaderboardPreviewProps = {
  leaderboardData: LeaderboardEntry[];
}

export function LeaderboardPreview({ leaderboardData }: LeaderboardPreviewProps) {
  // Get top 3 + current user if not in top 3
  const top3 = leaderboardData.slice(0, 3);
  const currentUserEntry = leaderboardData.find(u => u.isCurrentUser);

  let previewData = [...top3];
  if (currentUserEntry && !top3.some(u => u.rank === currentUserEntry.rank)) {
    previewData.push(currentUserEntry);
  }

  const getAvatar = (rank: number, isCurrentUser?: boolean) => {
    if (rank === 1) return "🏆";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    if (isCurrentUser) return "👤";
    return "👤";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.1 }}
      className="bg-white rounded-3xl p-6 shadow-lg border-2 border-violet-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-violet-600" />
          <h3 className="text-xl font-bold">Leaderboard</h3>
        </div>
        <Link href="/dashboard/leaderboard" className="text-sm text-violet-600 hover:text-violet-700">
          View Full
        </Link>
      </div>

      <div className="space-y-3">
        {previewData.map((learner, index) => (
          <motion.div
            key={learner.rank}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-2xl ${learner.isCurrentUser
              ? "bg-gradient-to-r from-violet-100 to-purple-100 border-2 border-violet-300"
              : "bg-gray-50"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getAvatar(learner.rank, learner.isCurrentUser)}</div>
              <div>
                <div className={`font-bold ${learner.isCurrentUser ? "text-violet-700" : "text-gray-900"}`}>
                  {learner.name}
                </div>
                <div className="text-sm text-gray-600">Level {learner.level}</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700">
              {learner.xp.toLocaleString('en-US')} XP
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}