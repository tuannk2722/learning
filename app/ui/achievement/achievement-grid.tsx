'use client';
import { Achievement } from '@/app/lib/definitions/definitions';
import { motion } from 'motion/react';
import { DynamicIcon } from '../dynamic-icon';

type Props = {
  achievements: Achievement[],
}

export function AchievementGrid({ achievements }: Props) {

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'epic':
        return 'bg-purple-100 text-purple-700';
      case 'rare':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement, index) => {
        return (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: achievement.unlocked ? 1.05 : 1 }}
            className={`relative bg-white rounded-2xl p-6 border ${achievement.unlocked
              ? 'border-gray-200 shadow-sm hover:shadow-lg'
              : 'border-gray-100 opacity-50'
              } transition-all cursor-pointer overflow-hidden`}
          >
            {achievement.unlocked && (
              <div
                className="absolute inset-0 opacity-30 bg-gradient-to-br"
                style={{ backgroundImage: `linear-gradient(to bottom right, ${achievement.bgColor.replace('from-', '').replace('to-', '')})` }}
              />
            )}

            <div className="relative z-10">
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${achievement.unlocked ? '' : 'bg-gray-100'
                  }`}
                style={achievement.unlocked ? { background: achievement.bgColor.includes('from-') ? undefined : achievement.bgColor } : {}}
              >
                <DynamicIcon
                  name={achievement.icon}
                  className={`w-8 h-8 ${achievement.unlocked ? achievement.color : 'text-gray-400'}`}
                />
              </div>

              <h3 className="font-medium mb-1">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>

              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(achievement.rarity)}`}>
                  {achievement.rarity}
                </span>

                {achievement.unlocked && achievement.unlockedDate && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(achievement.unlockedDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  )
}