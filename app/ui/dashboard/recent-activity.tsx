'use client';

import { motion } from "motion/react";
import { Target } from "lucide-react";
import Link from "next/link";
import { HistoryEvent } from "@/app/lib/definitions/definitions";
import { CONFIG } from "@/app/ui/history/item";

export default function RecentActivity({ activities = [] }: { activities?: HistoryEvent[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-violet-600" />
          <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
        </div>
        <Link
          href="/dashboard/profile/history"
          className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
        >
          View Full
        </Link>
      </div>

      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((activity, index) => {
            const config = CONFIG[activity.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-6 h-6 ${config.iconColor}`} />
                  <div>
                    <div className="font-semibold text-gray-900">{activity.title}</div>
                    <div className="text-sm text-gray-600">{activity.type}</div>
                  </div>
                </div>
                {activity.xp > 0 && (
                  <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                    +{activity.xp} XP
                  </span>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-400 text-sm">
            Not recent activities yet
          </div>
        )}
      </div>
    </motion.div>
  );
}
