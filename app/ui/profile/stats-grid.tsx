'use client';

import { BookOpen, Crown, Flame, Star, Target, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';


export function ProfileStatsGrid() {

  return (
    <div className="mb-8 grid md:grid-cols-2 gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-violet-600" />
          Learning Activity
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-violet-50 rounded-2xl">
            <span className="text-gray-700">Courses Enrolled</span>
            <span className="text-2xl font-bold text-violet-600">8</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl">
            <span className="text-gray-700">Courses Completed</span>
            <span className="text-2xl font-bold text-emerald-600">3</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl">
            <span className="text-gray-700">Lessons Completed</span>
            <span className="text-2xl font-bold text-blue-600">178</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-orange-50 rounded-2xl">
            <span className="text-gray-700">Study Time</span>
            <span className="text-2xl font-bold text-orange-600">52h</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-violet-600" />
          Outstanding Achievements
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
            <Crown className="w-8 h-8 text-yellow-600" />
            <div>
              <div className="font-bold text-gray-900">Gold Rank</div>
              <div className="text-sm text-gray-600">Top 15% global</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200">
            <Target className="w-8 h-8 text-violet-600" />
            <div>
              <div className="font-bold text-gray-900">Quest Master</div>
              <div className="text-sm text-gray-600">150 courses completed</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
            <Star className="w-8 h-8 text-emerald-600" />
            <div>
              <div className="font-bold text-gray-900">Perfectionist</div>
              <div className="text-sm text-gray-600">20 courses with perfect scores</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200">
            <Flame className="w-8 h-8 text-orange-600" />
            <div>
              <div className="font-bold text-gray-900">Dedicated Learner</div>
              <div className="text-sm text-gray-600">Streak maximum: 21 days</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}