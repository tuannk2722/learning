'use client';
import { Target } from 'lucide-react';
import QuestCard from './quest-card';

interface Quest {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  type: string;
  completions: number;
  active: boolean;
}

interface QuestListProps {
  dailyQuests: Quest[];
  weeklyQuests: Quest[];
  specialQuests: Quest[];
}

export default function QuestList({ dailyQuests, weeklyQuests, specialQuests }: QuestListProps) {
  return (
    <div className="space-y-12">
      {/* Daily Quests */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          Daily Quests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dailyQuests.map((quest, index) => (
            <QuestCard key={quest.id} quest={quest} index={index} />
          ))}
        </div>
      </section>

      {/* Weekly Quests */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          Weekly Quests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weeklyQuests.map((quest, index) => (
            <QuestCard key={quest.id} quest={quest} index={index + dailyQuests.length} />
          ))}
        </div>
      </section>

      {/* Special Quests */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <Target className="w-6 h-6 text-orange-600" />
          </div>
          Special Quests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialQuests.map((quest, index) => (
            <QuestCard key={quest.id} quest={quest} index={index + dailyQuests.length + weeklyQuests.length} />
          ))}
        </div>
      </section>
    </div>
  );
}
