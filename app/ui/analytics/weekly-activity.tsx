'use client';

import { Calendar } from "lucide-react";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AnalyticsWeeklyActivity({ weeklyActivity }: { weeklyActivity: { day: string, hours: number, lessons: number }[] }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100"
    >
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-violet-600" />
        Weekly Activity
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyActivity}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="day" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #8B5CF6',
              borderRadius: '12px',
              padding: '12px'
            }}
          />
          <Legend />
          <Bar dataKey="lessons" fill="#8B5CF6" name="Lessons" radius={[8, 8, 0, 0]} />
          <Bar dataKey="hours" fill="#06B6D4" name="Hours" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}