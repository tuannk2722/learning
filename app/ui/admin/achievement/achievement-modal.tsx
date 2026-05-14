'use client';
import { motion } from 'motion/react';
import { Upload } from 'lucide-react';

interface AchievementModalProps {
  onClose: () => void;
}

export default function AchievementModal({ onClose }: AchievementModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-6">Create New Badge</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Badge Name</label>
            <input
              type="text"
              placeholder="e.g., Study Master"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
            <textarea
              placeholder="Describe what users need to do to earn this badge"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Rarity</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                <option>Common</option>
                <option>Rare</option>
                <option>Epic</option>
                <option>Legendary</option>
                <option>Mythic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Status</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Achievement Condition</label>
            <input
              type="text"
              placeholder="e.g., streak_days >= 7"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <p className="text-xs text-muted-foreground mt-1 italic">Use variables like: streak_days, completed_courses, quiz_score, etc.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Badge Icon/Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-2 font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PNG, JPG or SVG (max 2MB)</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200"
            >
              Create Badge
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
