'use client';
import { motion } from 'motion/react';
import { Trophy, Star } from 'lucide-react';

interface StatsProps {
  total: number;
  active: number;
  awarded: number;
  thisWeek: number;
}

export default function AchievementStats({ total, active, awarded, thisWeek }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <span className="text-sm text-muted-foreground">Total Badges</span>
        </div>
        <div className="text-3xl font-bold">{total}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-5 h-5 text-green-600" />
          <span className="text-sm text-muted-foreground">Active Badges</span>
        </div>
        <div className="text-3xl font-bold">{active}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-5 h-5 text-purple-600" />
          <span className="text-sm text-muted-foreground">Total Awarded</span>
        </div>
        <div className="text-3xl font-bold">{awarded.toLocaleString()}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-5 h-5 text-orange-600" />
          <span className="text-sm text-muted-foreground">This Week</span>
        </div>
        <div className="text-3xl font-bold">{thisWeek.toLocaleString()}</div>
      </motion.div>
    </div>
  );
}
