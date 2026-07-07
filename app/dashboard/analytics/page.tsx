import { AnalyticsStatsGrid } from '@/app/ui/analytics/stats-grid';
import { AnalyticsWeeklyXP } from '@/app/ui/analytics/analytics-weekly-xp';
import { AnalyticsTitle } from '@/app/ui/analytics/title';
import { AnalyticsWeeklyActivity } from '@/app/ui/analytics/weekly-activity';
import { QuizHistorySection } from '@/app/ui/analytics/quiz-history-section';
import { getOverviewStats, getWeeklyActivity, getWeeklyXP } from '@/app/lib/data/analytics';
import { auth } from '@/auth';
import { getQuizHistory } from '@/app/lib/data/quiz';
import { Suspense } from 'react';
import { StatsOverviewSkeleton } from '@/app/ui/skeleton/skeletons';
import { ChartSkeleton, QuizAttemptSkeleton } from '@/app/ui/skeleton/analytic';

export default async function Analytics() {
  const session = await auth();
  const userId = session?.user?.id;
  const quizHistory = userId ? await getQuizHistory(userId) : [];
  const stats = userId ? await getOverviewStats(userId) : [];
  const weeklyActivity = userId ? await getWeeklyActivity(userId) : [];
  const weeklyXP = userId ? await getWeeklyXP(userId) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-5 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <AnalyticsTitle />

          {/* Stats Grid */}
          <Suspense fallback={<StatsOverviewSkeleton />}>
            <AnalyticsStatsGrid stats={stats} />
          </Suspense>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Activity */}
            <Suspense fallback={<ChartSkeleton />}>
              <AnalyticsWeeklyActivity weeklyActivity={weeklyActivity} />
            </Suspense>

            {/* Subject Breakdown */}
            <Suspense fallback={<ChartSkeleton />}>
              <AnalyticsWeeklyXP weeklyXP={weeklyXP} />
            </Suspense>
          </div>

          {/* Quiz History */}
          <div className="mt-8">
            <Suspense fallback={<QuizAttemptSkeleton />}>
              <QuizHistorySection attempts={quizHistory} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
