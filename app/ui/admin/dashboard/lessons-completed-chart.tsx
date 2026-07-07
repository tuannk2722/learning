'use client';
import { motion } from 'motion/react';

interface LessonData {
  day: string;
  count: number;
}

export default function LessonsCompletedChart({ data }: { data: LessonData[] }) {
  const maxLessons = Math.max(...data.map(d => d.count));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-6">Lessons Completed</h2>

      <div className="flex items-end justify-between h-64 gap-3">
        {data.map((day, index) => (
          <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex items-end h-full">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.count / maxLessons) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg min-h-2"
              />
            </div>
            <div className="text-sm text-muted-foreground">{day.day}</div>
            <div className="text-xs font-medium">{day.count}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
