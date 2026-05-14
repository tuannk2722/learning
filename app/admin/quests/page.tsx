import QuestHeader from '@/app/ui/admin/quests/quest-header';
import QuestStats from '@/app/ui/admin/quests/quest-stats';
import QuestList from '@/app/ui/admin/quests/quest-list';

export default async function QuestManagementPage() {
  // MOCK DATA (Sau này fetch từ DB)
  const dailyQuests = [
    {
      id: 1,
      title: 'Complete 2 Lessons',
      description: 'Finish at least 2 lessons today',
      xpReward: 50,
      type: 'daily',
      completions: 1245,
      active: true
    },
    {
      id: 2,
      title: 'Study for 30 Minutes',
      description: 'Spend at least 30 minutes learning',
      xpReward: 40,
      type: 'daily',
      completions: 2103,
      active: true
    },
    {
      id: 3,
      title: 'Take a Quiz',
      description: 'Complete any quiz with 70% or higher',
      xpReward: 60,
      type: 'daily',
      completions: 892,
      active: true
    },
  ];

  const weeklyQuests = [
    {
      id: 4,
      title: 'Complete 10 Lessons',
      description: 'Finish 10 lessons this week',
      xpReward: 200,
      type: 'weekly',
      completions: 456,
      active: true
    },
    {
      id: 5,
      title: 'Perfect Week',
      description: 'Complete all daily quests for 7 days',
      xpReward: 300,
      type: 'weekly',
      completions: 145,
      active: true
    },
  ];

  const specialQuests = [
    {
      id: 6,
      title: 'Course Marathon',
      description: 'Complete an entire course in one week',
      xpReward: 500,
      type: 'special',
      completions: 78,
      active: true
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <QuestHeader />
        
        <QuestStats 
          activeQuests="12" 
          dailyCompletions="4,240" 
          totalXPRewarded="125,680" 
        />

        <QuestList 
          dailyQuests={dailyQuests}
          weeklyQuests={weeklyQuests}
          specialQuests={specialQuests}
        />
      </div>
    </div>
  );
}
