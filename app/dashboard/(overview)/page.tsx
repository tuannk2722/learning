import { StatsOverview } from "@/app/ui/dashboard/stats-overview";
import { DailyQuests } from "@/app/ui/dashboard/daily-quests";
import { ContinueCourses } from "@/app/ui/dashboard/continue-courses";
import { AchievementsCard } from "@/app/ui/dashboard/achievements";
import { LeaderboardPreview } from "@/app/ui/dashboard/leaderboard-preview";
import { HeaderDashboard } from "@/app/ui/dashboard/header";
import { Suspense } from "react";
import {
  StatsOverviewSkeleton,
  DailyQuestsSkeleton,
  ContinueCoursesSkeleton,
  AchievementsCardSkeleton,
  LeaderboardPreviewSkeleton
} from "@/app/ui/skeletons";
import { fetchUserEnrolledCourses } from "@/app/lib/data/courses";
import { auth } from "@/auth";

export default async function DashboardHome() {
  const session = await auth();
  const user_id = session?.user?.id;
  const continueCourses = await fetchUserEnrolledCourses(user_id!);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <HeaderDashboard />

          {/* Stats Overview */}
          <Suspense fallback={<StatsOverviewSkeleton />}>
            <StatsOverview />
          </Suspense>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Daily Quests */}
              <Suspense fallback={<DailyQuestsSkeleton />}>
                <DailyQuests />
              </Suspense>

              {/* Continuing Courses */}
              <Suspense fallback={<ContinueCoursesSkeleton />}>
                <ContinueCourses data={continueCourses} />
              </Suspense>
            </div>

            <div className="space-y-8">
              {/* Recent Achievements */}
              <Suspense fallback={<AchievementsCardSkeleton />}>
                <AchievementsCard />
              </Suspense>

              {/* Leaderboard Preview */}
              <Suspense fallback={<LeaderboardPreviewSkeleton />}>
                <LeaderboardPreview />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
