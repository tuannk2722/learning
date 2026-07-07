'use client';

import { toast } from "sonner";
import { motion } from "motion/react";
import { DynamicIcon } from "../dynamic-icon";
import { getColorClasses } from "@/app/lib/utils/color-classes";
import { UnlockedAchievement } from "@/app/lib/definitions/definitions";

export function showAchievementToasts(achievements: UnlockedAchievement[]) {
  if (!achievements || achievements.length === 0) return;

  achievements.forEach((ach, index) => {
    setTimeout(() => {
      const { gradientLight } = getColorClasses(ach.theme_color);

      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xl flex items-center gap-4 w-[350px] relative overflow-hidden"
        >
          <div className={`absolute top-0 right-0 w-32 h-32 opacity-20 rounded-full -mr-10 -mt-10 blur-2xl ${ach.theme_color || 'bg-amber-400'}`} />

          <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${ach.theme_color || 'bg-amber-100'} shadow-inner border border-white/50 z-10`}>
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradientLight} flex items-center justify-center`}>
              <DynamicIcon
                name={ach.icon_name || "Trophy"}
                className={`w-8 h-8 ${ach.theme_color ? ach.theme_color : 'text-gray-400'}`}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0 z-10">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 block">
              Achievement Unlocked
            </span>
            <h4 className="text-sm font-bold text-gray-900 truncate">
              {ach.title}
            </h4>
            {ach.reward_xp && ach.reward_xp > 0 && (
              <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                +{ach.reward_xp} XP
              </p>
            )}
          </div>
        </motion.div>
      ), {
        duration: 4000,
        position: 'top-right',
      });
    }, index * 400); // slight stagger
  });
}
