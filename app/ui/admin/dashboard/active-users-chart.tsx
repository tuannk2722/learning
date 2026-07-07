'use client';

import { Users } from "lucide-react";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DAUData {
  day: string;
  users: number;
}

export default function ActiveUsersChart({ data }: { data: DAUData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-3xl p-8 shadow-lg border-2 border-blue-100"
    >
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
        <Users className="w-6 h-6 text-blue-600" />
        Daily Active Users
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="day" stroke="#6B7280" />
          <YAxis stroke="#6B7280" allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '2px solid #3B82F6',
              borderRadius: '12px',
              padding: '12px'
            }}
          />
          <Bar dataKey="users" fill="#3B82F6" name="Active Users" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
