'use client';
import { motion } from 'motion/react';
import { DynamicIcon } from '../../dynamic-icon';
import { getColorClasses } from '@/app/lib/utils/color-palette';

interface AchievementData {
  name: string;
  awarded: number;
  description: string;
  iconName: string;
  themeColor: string;
}

export default function TopAchievements({ data }: { data: AchievementData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-6">Top Achievements</h2>

      <div className="space-y-4">
        {data.map((item, index) => {
          const { gradient } = getColorClasses(item.themeColor);
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                  <DynamicIcon name={item.iconName} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <div className="text-sm text-green-600 font-medium">{item.awarded} awarded</div>
            </motion.div>

          )
        })}
      </div>
    </motion.div>
  );
}
