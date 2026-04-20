'use client';

import { motion } from 'motion/react';
import { DynamicIcon } from '../dynamic-icon';

export function AnalyticsStatsGrid({ stat, index }: { stat: any, index: number }) {

  return (
    <motion.div
      key={stat.label}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
          <DynamicIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
        </div>
        <span className="text-sm text-green-600 font-medium">{stat.change}</span>
      </div>
      <div className="text-3xl mb-1">{stat.value}</div>
      <div className="text-muted-foreground text-sm">{stat.label}</div>
    </motion.div>
  )
}