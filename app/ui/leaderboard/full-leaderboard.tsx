'use client';

import { LeaderboardEntry } from "@/app/lib/definitions/definitions";
import { Crown, Medal, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

type FullLeaderboardProps = {
  leaderboardData: LeaderboardEntry[];
}

export function FullLeaderboard({ leaderboardData }: FullLeaderboardProps) {

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return null;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-muted-foreground">
        <div className="col-span-1">Rank</div>
        <div className="col-span-5">Learner</div>
        <div className="col-span-2">Level</div>
        <div className="col-span-2">XP</div>
        <div className="col-span-2">Streak</div>
      </div>

      {leaderboardData.map((user, index) => (
        <motion.div
          key={user.rank}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + index * 0.05 }}
          className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-100 items-center ${user.isCurrentUser ? 'bg-indigo-50' : 'hover:bg-gray-50'
            } transition-colors`}
        >
          <div className="col-span-1 flex items-center gap-2">
            <span className="font-medium">{user.rank}</span>
            {getRankIcon(user.rank)}
          </div>

          <div className="col-span-5 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${user.isCurrentUser
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
              : 'bg-gray-200'
              } flex items-center justify-center text-white font-medium text-sm overflow-hidden`}>
              {user.avatar.startsWith('http') || user.avatar.startsWith('/') ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.avatar
              )}
            </div>
            <div>
              <div className="font-medium">{user.name}</div>
              {user.isCurrentUser && (
                <div className="text-xs text-indigo-600">You</div>
              )}
            </div>
          </div>

          <div className="col-span-2">{user.level}</div>
          <div className="col-span-2 font-medium">{user.xp.toLocaleString('en-US')}</div>
          <div className="col-span-2 flex items-center gap-2">
            <span>{user.streak} days</span>
            {getTrendIcon(user.trend)}
          </div>
        </motion.div>
      ))}
    </div>
  )
}