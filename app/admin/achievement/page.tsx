'use client';
import { motion } from 'motion/react';
import { Plus, Trophy, Edit2, Trash2, Upload, Star } from 'lucide-react';
import { useState } from 'react';

export default function BadgeManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const badges = [
    {
      id: 1,
      name: '7 Day Streak',
      description: 'Study for 7 consecutive days',
      rarity: 'common',
      condition: 'streak_days >= 7',
      awarded: 234,
      icon: '🔥',
      active: true
    },
    {
      id: 2,
      name: 'Perfect Week',
      description: 'Complete all daily goals for a week',
      rarity: 'rare',
      condition: 'weekly_goals_completed >= 7',
      awarded: 145,
      icon: '⭐',
      active: true
    },
    {
      id: 3,
      name: 'Quiz Master',
      description: 'Score 100% on 10 quizzes',
      rarity: 'epic',
      condition: 'perfect_quizzes >= 10',
      awarded: 89,
      icon: '🏆',
      active: true
    },
    {
      id: 4,
      name: 'Speed Learner',
      description: 'Complete 5 lessons in one day',
      rarity: 'rare',
      condition: 'daily_lessons >= 5',
      awarded: 167,
      icon: '⚡',
      active: true
    },
    {
      id: 5,
      name: 'Course Champion',
      description: 'Complete 10 courses',
      rarity: 'legendary',
      condition: 'completed_courses >= 10',
      awarded: 23,
      icon: '👑',
      active: false
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'epic': return 'bg-purple-100 text-purple-700';
      case 'rare': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Badge & Achievement Management
              </h1>
              <p className="text-muted-foreground">Create and manage gamification badges</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Create Badge
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
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
            <div className="text-3xl font-bold">{badges.length}</div>
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
            <div className="text-3xl font-bold">{badges.filter(b => b.active).length}</div>
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
            <div className="text-3xl font-bold">{badges.reduce((sum, b) => sum + b.awarded, 0)}</div>
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
            <div className="text-3xl font-bold">658</div>
          </motion.div>
        </div>

        {/* Badge List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">All Badges</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Badge</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rarity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Awarded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {badges.map((badge, index) => (
                  <motion.tr
                    key={badge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center text-2xl">
                          {badge.icon}
                        </div>
                        <div>
                          <div className="font-medium">{badge.name}</div>
                          <div className="text-sm text-muted-foreground">{badge.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                        {badge.rarity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">{badge.condition}</code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{badge.awarded.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {badge.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-slate-100 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-slate-100 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Badge Modal */}
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">Create New Badge</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Badge Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Study Master"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    placeholder="Describe what users need to do to earn this badge"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rarity</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Common</option>
                      <option>Rare</option>
                      <option>Epic</option>
                      <option>Legendary</option>
                      <option>Mythic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Achievement Condition</label>
                  <input
                    type="text"
                    placeholder="e.g., streak_days >= 7"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Use variables like: streak_days, completed_courses, quiz_score, etc.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Badge Icon/Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or SVG (max 2MB)</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Create Badge
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
