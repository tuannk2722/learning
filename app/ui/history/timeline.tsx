'use client';
import { motion } from 'motion/react';
import { HistoryEvent } from '@/app/lib/definitions/definitions';
import { HistoryItem } from './item';
import { getDateLabel } from '@/app/lib/utils/date';
import { HistoryEmptyState } from './empty-state';

export function HistoryTimeline({ events }: { events: HistoryEvent[] }) {
  if (events.length === 0) {
    return <HistoryEmptyState />;
  }

  const groupedByDate = events.reduce((acc, event) => {
    const dateKey = getDateLabel(event.completedAt);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, HistoryEvent[]>);

  return (
    <div className="relative">
      {/* Connecting Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100" />

      {Object.entries(groupedByDate).map(([date, items], groupIndex) => (
        <div key={date} className="mb-12 last:mb-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="text-sm font-semibold text-gray-400 mb-6 ml-16 uppercase tracking-wider"
          >
            {date}
          </motion.div>

          <div className="space-y-6">
            {items.map((activity, index) => (
              <HistoryItem
                key={activity.id}
                activity={activity}
                index={groupIndex * 2 + index}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
