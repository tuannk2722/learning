'use client';

import { BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LessonData {
  day: string;
  count: number;
}

export default function LessonsCompletedChart({ data }: { data: LessonData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white rounded-3xl p-8 shadow-lg border-2 border-green-100"
    >
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
        <BookOpen className="w-6 h-6 text-green-600" />
        Lessons Completed
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="day" stroke="#6B7280" />
          <YAxis stroke="#6B7280" allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #10B981',
              borderRadius: '12px',
              padding: '12px'
            }}
          />
          <Bar dataKey="count" fill="#10B981" name="Lessons Completed" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
