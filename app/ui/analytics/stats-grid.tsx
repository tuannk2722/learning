'use client';

import { motion } from 'motion/react';
import { DynamicIcon } from '../dynamic-icon';
import { getColorClasses } from '@/app/lib/utils/color-palette';
import { AnalyticsStats } from '@/app/lib/definitions/definitions';

export function AnalyticsStatsGrid({ stats }: { stats: AnalyticsStats[] }) {

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => {
        const { text, gradientLight } = getColorClasses(stat.color);

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-lg border-2 border-violet-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientLight} flex items-center justify-center`}>
                <DynamicIcon name={stat.icon} className={`w-6 h-6 ${text}`} />
              </div>
              <div>
                <div className="text-sm text-gray-600">{stat.label}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}