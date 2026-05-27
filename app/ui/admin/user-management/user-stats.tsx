'use client';
import { motion } from 'motion/react';
import { Users, BarChart3 } from 'lucide-react';

interface UserStatsProps {
  total: number;
  activeThisWeek: number;
  newThisMonth: number;
}

export default function UserStats({ total, activeThisWeek, newThisMonth }: UserStatsProps) {
  const stats = [
    { label: 'Total Users', value: total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active This Week', value: activeThisWeek, icon: BarChart3, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'New This Month', value: newThisMonth, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-muted-foreground text-sm">{stat.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
