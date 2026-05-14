'use client';
import { motion } from 'motion/react';

interface DAUData {
  day: string;
  users: number;
}

export default function ActiveUsersChart({ data }: { data: DAUData[] }) {
  const maxDAU = Math.max(...data.map(d => d.users));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-6">Daily Active Users</h2>

      <div className="flex items-end justify-between h-64 gap-3">
        {data.map((day, index) => (
          <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex items-end h-full">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.users / maxDAU) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg min-h-2"
              />
            </div>
            <div className="text-sm text-muted-foreground">{day.day}</div>
            <div className="text-xs font-medium">{day.users.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
