'use client';

import { motion } from 'motion/react';
import { DynamicIcon } from '../dynamic-icon';
import { getColorClasses } from '@/app/lib/utils/color-classes';
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
            {/* <div className="flex items-center gap-2 text-sm">
              <span className={`${text} font-medium`}>{stat.change}</span>
              <span className="text-gray-600">so với tuần trước</span>
            </div> */}
          </motion.div>
        )
      })}
    </div>
    // <motion.div
    //   key={stat.label}
    //   initial={{ opacity: 0, y: 20 }}
    //   animate={{ opacity: 1, y: 0 }}
    //   transition={{ delay: index * 0.1 }}
    //   className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    // >
    //   <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
    //     <DynamicIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
    //   </div>
    //   {/* <div className="flex items-start justify-between mb-4">
    //     <span className="text-sm text-green-600 font-medium">{stat.change}</span>
    //   </div> */}
    //   <div className="text-3xl mb-1">{stat.value}</div>
    //   <div className="text-muted-foreground text-sm">{stat.label}</div>
    // </motion.div>
  )
}