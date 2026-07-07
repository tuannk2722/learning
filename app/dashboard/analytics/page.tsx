import { AnalyticsStatsGrid } from '@/app/ui/analytics/stats-grid';
import { AnalyticsWeeklyXP } from '@/app/ui/analytics/analytics-weekly-xp';
import { AnalyticsTitle } from '@/app/ui/analytics/title';
import { AnalyticsWeeklyActivity } from '@/app/ui/analytics/weekly-activity';
import { QuizHistorySection } from '@/app/ui/analytics/quiz-history-section';
import { getOverviewStats, getWeeklyActivity, getWeeklyXP } from '@/app/lib/data/analytics';
import { auth } from '@/auth';
import { getQuizHistory } from '@/app/lib/data/quiz';

export default async function Analytics() {
  const session = await auth();
  const userId = session?.user?.id;
  const quizHistory = userId ? await getQuizHistory(userId) : [];
  const stats = userId ? await getOverviewStats(userId) : [];
  const weeklyActivity = userId ? await getWeeklyActivity(userId) : [];
  const weeklyXP = userId ? await getWeeklyXP(userId) : [];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <AnalyticsTitle />

        {/* Stats Grid */}
        <AnalyticsStatsGrid stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Activity */}
          <AnalyticsWeeklyActivity weeklyActivity={weeklyActivity} />

          {/* Subject Breakdown */}
          <AnalyticsWeeklyXP weeklyXP={weeklyXP} />
        </div>

        {/* Quiz History */}
        <div className="mt-8">
          <QuizHistorySection attempts={quizHistory} />
        </div>
      </div>
    </div>
  );
}
