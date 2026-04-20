'use client';

import { motion } from "motion/react";

export function AnalyticsSubjectbreakdown({ subjectBreakdown }: { subjectBreakdown: any[] }) {

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <h2 className="text-xl mb-6">Subject Breakdown</h2>

      <div className="space-y-6">
        {subjectBreakdown.map((subject, index) => (
          <div key={subject.subject}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{subject.subject}</span>
              <div className="text-right">
                <div className="text-sm font-medium">{subject.percentage}%</div>
                <div className="text-xs text-muted-foreground">{subject.hours}h</div>
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${subject.percentage}%` }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                className={`h-full ${subject.color} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="text-sm text-muted-foreground mb-3">Total time distribution</div>
        <div className="grid grid-cols-2 gap-2">
          {subjectBreakdown.map((subject) => (
            <div key={subject.subject} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${subject.color}`} />
              <span className="text-xs text-muted-foreground">{subject.subject}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}