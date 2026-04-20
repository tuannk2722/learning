import { motion } from "motion/react";
import { Crown, Flame, Star, Zap } from "lucide-react";

const userStats = {
  name: "Nguyễn Văn A",
  level: 15,
  currentXP: 12500,
  nextLevelXP: 15000,
  streak: 7,
  totalXP: 45000,
  rank: "Gold",
  leaderboardPosition: 127
};

const xpProgress = (userStats.currentXP / userStats.nextLevelXP) * 100;

export function StatsOverview() {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-12">
      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <Crown className="w-8 h-8" />
          <span className="text-3xl font-bold">#{userStats.leaderboardPosition}</span>
        </div>
        <div>
          <div className="text-sm opacity-90 mb-1">Current Level</div>
          <div className="text-4xl font-bold">Level {userStats.level}</div>
          <div className="text-sm opacity-90 mt-2">{userStats.rank} Rank</div>
        </div>
      </motion.div>

      {/* XP Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-3xl p-6 shadow-lg border-2 border-violet-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-sm text-gray-600">XP to Level {userStats.level + 1}</div>
            <div className="text-2xl font-bold text-gray-900">{userStats.currentXP}/{userStats.nextLevelXP}</div>
          </div>
        </div>
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-3xl p-6 shadow-lg border-2 border-orange-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Current Streak</div>
            <div className="text-3xl font-bold text-gray-900">{userStats.streak} days</div>
          </div>
        </div>
        <div className="text-sm text-orange-600 font-medium">🔥 Continue the streak!</div>
      </motion.div>

      {/* Total XP Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-3xl p-6 shadow-lg border-2 border-emerald-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Total XP Earned</div>
            <div className="text-3xl font-bold text-gray-900">{userStats.totalXP.toLocaleString('en-US')}</div>
          </div>
        </div>
        <div className="text-sm text-emerald-600 font-medium">⭐ Outstanding!</div>
      </motion.div>
    </div>
  );
}