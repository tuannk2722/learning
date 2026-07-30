import { Target } from "lucide-react";
import { DailyQuest } from "@/app/lib/definitions/quests";
import { QuestItem } from "./quest-item";


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