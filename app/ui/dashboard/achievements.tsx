'use client';

import { AchievementPreview } from "@/app/lib/definitions/definitions";
import { getColorClasses } from "@/app/lib/utils/color-palette";
import { Award, LinkIcon } from "lucide-react";
import { motion } from "motion/react";
import { DynamicIcon } from "../dynamic-icon";
import Link from "next/link";

export function AchievementsCard({ recentAchievements }: { recentAchievements: AchievementPreview[] }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="bg-white rounded-3xl p-6 shadow-lg border-2 border-violet-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-violet-600" />
          <h3 className="text-xl font-bold">Recent Achievements</h3>
        </div>
        <Link title="View All Achievements" href="/dashboard/achievements" className="text-sm text-violet-600 hover:text-violet-700">
          <LinkIcon />
        </Link>
      </div>

      <div className="space-y-4">
        {recentAchievements.map((achievement, index) => {
          const { gradient } = getColorClasses(achievement.theme_color);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                <DynamicIcon name={achievement.icon} className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-900">{achievement.title}</div>
                <div className="text-sm text-gray-600">{achievement.description}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  );
}