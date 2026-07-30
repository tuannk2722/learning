import { CheckCircle2 } from "lucide-react";
import { DynamicIcon } from "../dynamic-icon";
import { DailyQuest } from "@/app/lib/definitions/quests";

export function QuestItem({ quest }: { quest: DailyQuest }) {
  const percent = Math.min(
    Math.round(((quest.current_progress || 0) / quest.target_value) * 100),
    100
  );

  return (
    <div
      className={`p-4 rounded-2xl border-2 transition-all ${quest.is_completed
        ? "bg-emerald-50 border-emerald-200"
        : "bg-gray-50 border-gray-200 hover:border-violet-300"
        }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {quest.is_completed ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 shrink-0 flex items-center justify-center">
              {quest.icon_name && (
                <DynamicIcon name={quest.icon_name} className="w-3.5 h-3.5 text-gray-400" />
              )}
            </div>
          )}
          <div>
            <div className={`font-bold ${quest.is_completed ? "text-emerald-700 line-through" : "text-gray-900"}`}>
              {quest.title}
            </div>
            <div className={`text-sm text-gray-500`}>
              {quest.description}
            </div>
            <div className="text-sm text-yellow-500">+{quest.reward_xp} XP</div>
          </div>
        </div>
        <div className="text-sm font-medium text-gray-700 shrink-0">
          {quest.current_progress}/{quest.target_value}
        </div>
      </div>
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${quest.is_completed ? "bg-emerald-500" : "bg-violet-500"
            }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}