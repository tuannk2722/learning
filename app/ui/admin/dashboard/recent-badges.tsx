'use client';
import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';

interface BadgeData {
  badge: string;
  awarded: number;
  trend: string;
}

export default function RecentBadges({ data }: { data: BadgeData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-6">Recent Badges Awarded</h2>

      <div className="space-y-4">
        {data.map((item, index) => (
          <motion.div
            key={item.badge}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">{item.badge}</h3>
                <p className="text-sm text-muted-foreground">{item.awarded} awarded</p>
              </div>
            </div>
            <div className="text-sm text-green-600 font-medium">{item.trend}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
