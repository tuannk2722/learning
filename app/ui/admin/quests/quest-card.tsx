'use client';
import { motion } from 'motion/react';
import { Edit2, Trash2 } from 'lucide-react';

interface Quest {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  type: string;
  completions: number;
  active: boolean;
}

interface QuestCardProps {
  quest: Quest;
  index: number;
}

export default function QuestCard({ quest, index }: QuestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-lg text-gray-900">{quest.title}</h3>
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${quest.type === 'daily' ? 'bg-blue-100 text-blue-700' :
                quest.type === 'weekly' ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'
              }`}>
              {quest.type}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{quest.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 font-bold text-amber-600">
              <span>+{quest.xpReward} XP</span>
            </div>
            <div className="text-gray-400 font-medium">
              {quest.completions.toLocaleString()} completions
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${quest.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
            {quest.active ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-4 py-2 border border-red-100 text-red-600 rounded-lg hover:bg-red-50 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
}
