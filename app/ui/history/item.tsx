'use client';
import { motion } from 'motion/react';
import { BookOpen, Award, Brain } from 'lucide-react';
import { HistoryEvent } from '@/app/lib/definitions/definitions';

const CONFIG = {
  lesson: {
    icon: BookOpen,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  quiz: {
    icon: Brain,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  achievement: {
    icon: Award,
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
};

export function HistoryItem({
  activity,
  index
}: {
  activity: HistoryEvent;
  index: number;
}) {
  const config = CONFIG[activity.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative flex items-start gap-4 group"
    >
      {/* Icon Circle */}
      <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0 z-10 transition-transform group-hover:scale-110`}>
        <Icon className={`w-6 h-6 ${config.iconColor}`} />
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-medium text-gray-900">{activity.title}</h3>
          {activity.xp > 0 && (
            <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
              +{activity.xp} XP
            </span>
          )}
        </div>
        {activity.course && (
          <p className="text-sm text-muted-foreground">{activity.course}</p>
        )}
      </div>
    </motion.div>
  );
}
