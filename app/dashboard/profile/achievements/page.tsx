import type { Metadata } from "next";
import { AchievementTitle } from '@/app/ui/achievement/title';
import { AchievementProgressBar } from '@/app/ui/achievement/progress-bar';
import { AchievementGrid } from '@/app/ui/achievement/achievement-grid';
import { getAchievements } from '@/app/lib/data/achievements';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: "My Achievements",
  description: "Track the badges and milestones you have earned on your Learning journey.",
  robots: { index: false, follow: false },
};

export default async function Achievements() {
  const session = await auth();
  const userId = session?.user?.id;

  const achievements = await getAchievements(userId);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-5 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <AchievementTitle />

          {/* Progress Bar */}
          <AchievementProgressBar unlockedCount={unlockedCount} totalAchievements={achievements.length} />

          {/* Achievements Grid */}
          <AchievementGrid achievements={achievements} />
        </div>
      </div>
    </div>
  );
}
