'use client';

import { toast } from "sonner";
import { QuestUpdateInfo } from "@/app/lib/definitions/quests";
import { CheckCircle2, Zap } from "lucide-react";
import { motion } from "motion/react";

export function showQuestToasts(updates: QuestUpdateInfo[]) {
  if (!updates || updates.length === 0) return;

  updates.forEach((quest, index) => {
    // Delay nhẹ nếu có nhiều quest cùng cập nhật để không bị đè lên nhau
    setTimeout(() => {
      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="bg-white border-2 border-violet-100 rounded-2xl p-4 shadow-2xl flex items-center gap-4 w-[350px]"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${quest.is_completed ? "bg-emerald-500" : "bg-violet-100"
            }`}>
            {quest.is_completed ? (
              <CheckCircle2 className="w-6 h-6 text-white" />
            ) : (
              <Zap className="w-6 h-6 text-violet-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">
                {quest.is_completed ? "Quest Completed" : "Quest Progress"}
              </span>
              <span className="text-[10px] font-bold text-gray-500">
                {quest.current_progress}/{quest.target_value}
              </span>
            </div>
            <h4 className="text-sm font-bold text-gray-900 truncate mb-2">
              {quest.title}
            </h4>

            <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(quest.current_progress / quest.target_value) * 100}%` }}
                className={`absolute top-0 left-0 h-full rounded-full ${quest.is_completed ? "bg-emerald-500" : "bg-violet-500"
                  }`}
              />
            </div>

            {quest.is_completed && (
              <p className="text-[10px] text-emerald-600 font-bold mt-1">
                + {quest.reward_xp} XP REWARDED! 🎉
              </p>
            )}
          </div>
        </motion.div>
      ), {
        duration: 3000,
        position: 'bottom-right',
      });
    }, index * 300);
  });
}
