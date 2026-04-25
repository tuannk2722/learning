import { AchievementTitle } from '@/app/ui/achievement/title';
import { AchievementProgressBar } from '@/app/ui/achievement/progress-bar';
import { AchievementGrid } from '@/app/ui/achievement/achievement-grid';

export default function Achievements() {
  const achievements = [
    {
      id: 1,
      icon: 'Flame',
      title: '7 Day Streak',
      description: 'Study for 7 consecutive days',
      unlocked: true,
      unlockedDate: '2026-04-02',
      rarity: 'common',
      color: 'text-orange-500',
      bgColor: 'from-orange-100 to-red-100'
    },
    {
      id: 2,
      icon: 'Trophy',
      title: 'Level 10',
      description: 'Reach level 10',
      unlocked: true,
      unlockedDate: '2026-03-28',
      rarity: 'common',
      color: 'text-yellow-500',
      bgColor: 'from-yellow-100 to-orange-100'
    },
    {
      id: 3,
      icon: 'Star',
      title: 'Perfect Week',
      description: 'Complete all daily goals for a week',
      unlocked: true,
      unlockedDate: '2026-04-05',
      rarity: 'rare',
      color: 'text-blue-500',
      bgColor: 'from-blue-100 to-cyan-100'
    },
    {
      id: 4,
      icon: 'Zap',
      title: 'Speed Learner',
      description: 'Complete 5 lessons in one day',
      unlocked: true,
      unlockedDate: '2026-03-15',
      rarity: 'rare',
      color: 'text-purple-500',
      bgColor: 'from-purple-100 to-pink-100'
    },
    {
      id: 5,
      icon: 'Brain',
      title: 'Quiz Master',
      description: 'Score 100% on 10 quizzes',
      unlocked: true,
      unlockedDate: '2026-03-22',
      rarity: 'epic',
      color: 'text-indigo-500',
      bgColor: 'from-indigo-100 to-purple-100'
    },
    {
      id: 6,
      icon: 'Target',
      title: '100 Sessions',
      description: 'Complete 100 study sessions',
      unlocked: false,
      unlockedDate: null,
      rarity: 'epic',
      color: 'text-purple-500',
      bgColor: 'from-purple-100 to-violet-100',
    },
    {
      id: 7,
      icon: 'Crown',
      title: 'Top 10',
      description: 'Reach top 10 on the leaderboard',
      unlocked: false,
      unlockedDate: null,
      rarity: 'legendary',
      color: 'text-yellow-500',
      bgColor: 'from-yellow-100 to-amber-100'
    },
    {
      id: 8,
      icon: 'Medal',
      title: 'Course Champion',
      description: 'Complete 10 courses',
      unlocked: false,
      unlockedDate: null,
      rarity: 'legendary',
      color: 'text-pink-500',
      bgColor: 'from-pink-100 to-rose-100',
    },
    {
      id: 9,
      icon: 'BookOpen',
      title: 'Knowledge Seeker',
      description: 'Study for 100 total hours',
      unlocked: false,
      unlockedDate: null,
      rarity: 'legendary',
      color: 'text-emerald-500',
      bgColor: 'from-emerald-100 to-green-100',
    },
    {
      id: 10,
      icon: 'Award',
      title: 'Ultimate Scholar',
      description: 'Unlock all other achievements',
      unlocked: false,
      unlockedDate: null,
      rarity: 'mythic',
      color: 'text-violet-500',
      bgColor: 'from-violet-100 to-purple-100'
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AchievementTitle />

        {/* Progress Bar */}
        <AchievementProgressBar unlockedCount={unlockedCount} totalAchievements={achievements.length} />

        {/* Achievements Grid */}
        <AchievementGrid achievements={achievements} />
      </div>
    </div>
  );
}
