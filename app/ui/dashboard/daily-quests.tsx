import { CheckCircle2, Target } from "lucide-react";
import { DynamicIcon } from "../dynamic-icon";
import { DailyQuest } from "@/app/lib/definitions/quests";

function QuestItem({ quest }: { quest: DailyQuest }) {
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
            <div className="text-sm text-gray-500">+{quest.reward_xp} XP</div>
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

export function DailyQuests({ quests }: { quests: DailyQuest[] }) {
  const completedCount = quests.filter((q) => q.is_completed).length;
  const allDone = completedCount === quests.length && quests.length > 0;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Daily Quests</h2>
            <p className="text-sm text-gray-600">Complete to earn bonus XP!</p>
          </div>
        </div>
        <div className={`text-sm font-semibold ${allDone ? "text-emerald-600" : "text-gray-600"}`}>
          {completedCount}/{quests.length} completed
        </div>
      </div>

      {allDone && (
        <div className="mb-4 py-3 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold text-center">
          🎉 All quests done for today! Come back tomorrow for more.
        </div>
      )}

      <div className="space-y-4">
        {quests.map((quest) => (
          <QuestItem key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
}