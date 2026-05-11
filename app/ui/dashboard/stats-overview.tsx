'use client';

import { motion } from "motion/react";
import { Crown, Flame, Star, Zap } from "lucide-react";
import { User } from "@/app/lib/definitions/user";
import { calculateLevel, getRankName } from "@/app/lib/utils/xp";

interface StatsOverviewProps {
  userInfo: User;
  rankPosition: number;
  currentStreak: number;
};

export function StatsOverview({ userInfo, rankPosition, currentStreak }: StatsOverviewProps) {
  const { level, currentXpInLevel, nextLevelXp, progress } = calculateLevel(userInfo.total_xp || 0);
  const rank = getRankName(level);

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-12">
      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group"
      >
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
        <div className="flex items-center justify-between mb-4">
          <Crown className="w-8 h-8" />
          <span className="text-3xl font-bold">#{rankPosition > 0 ? rankPosition : '-'}</span>
        </div>
        <div>
          <div className="text-sm opacity-90 mb-1">Current Level</div>
          <div className="text-4xl font-bold">Level {level}</div>
          <div className="text-sm opacity-90 mt-2">{rank} Rank</div>
        </div>
      </motion.div>

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">XP to Level {level + 1}</div>
            <div className="text-2xl font-bold text-gray-900">{currentXpInLevel}/{nextLevelXp}</div>
          </div>
        </div>
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-0 left-0 h-full bg-amber-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Current Streak</div>
            <div className="text-3xl font-bold text-gray-900">{currentStreak} days</div>
          </div>
        </div>
        <div className="text-sm text-orange-600 font-medium">🔥 Continue the streak!</div>
      </motion.div>

      {/* Total XP Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <Star className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Total XP Earned</div>
            <div className="text-3xl font-bold text-gray-900">{(userInfo.total_xp || 0).toLocaleString('en-US')}</div>
          </div>
        </div>
        <div className="text-sm text-emerald-600 font-medium">⭐ Outstanding!</div>
      </motion.div>
    </div>
  );
}