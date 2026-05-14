import AchievementHeader from '@/app/ui/admin/achievement/achievement-header';
import AchievementStats from '@/app/ui/admin/achievement/achievement-stats';
import AchievementList from '@/app/ui/admin/achievement/achievement-list';

export default async function BadgeManagementPage() {
  // Dữ liệu mock (Sau này thay bằng fetch từ DB)
  const badges = [
    {
      id: 1,
      name: '7 Day Streak',
      description: 'Study for 7 consecutive days',
      rarity: 'common',
      condition: 'streak_days >= 7',
      awarded: 234,
      icon: '🔥',
      active: true
    },
    {
      id: 2,
      name: 'Perfect Week',
      description: 'Complete all daily goals for a week',
      rarity: 'rare',
      condition: 'weekly_goals_completed >= 7',
      awarded: 145,
      icon: '⭐',
      active: true
    },
    {
      id: 3,
      name: 'Quiz Master',
      description: 'Score 100% on 10 quizzes',
      rarity: 'epic',
      condition: 'perfect_quizzes >= 10',
      awarded: 89,
      icon: '🏆',
      active: true
    },
    {
      id: 4,
      name: 'Speed Learner',
      description: 'Complete 5 lessons in one day',
      rarity: 'rare',
      condition: 'daily_lessons >= 5',
      awarded: 167,
      icon: '⚡',
      active: true
    },
    {
      id: 5,
      name: 'Course Champion',
      description: 'Complete 10 courses',
      rarity: 'legendary',
      condition: 'completed_courses >= 10',
      awarded: 23,
      icon: '👑',
      active: false
    },
  ];

  // Tính toán stats ngay tại Server
  const stats = {
    total: badges.length,
    active: badges.filter(b => b.active).length,
    awarded: badges.reduce((sum, b) => sum + b.awarded, 0),
    thisWeek: 658,
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AchievementHeader />
        
        <AchievementStats 
          total={stats.total} 
          active={stats.active} 
          awarded={stats.awarded} 
          thisWeek={stats.thisWeek} 
        />

        <AchievementList badges={badges} />
      </div>
    </div>
  );
}
