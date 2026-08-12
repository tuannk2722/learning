import type { Metadata } from "next";
import { AnalyticsStatsGrid } from '@/app/ui/analytics/stats-grid';
import { AnalyticsWeeklyXP } from '@/app/ui/analytics/analytics-weekly-xp';
import { AnalyticsTitle } from '@/app/ui/analytics/title';
import { QuizHistorySection } from '@/app/ui/analytics/quiz-history-section';
import { getOverviewStats, getWeeklyActivity, getWeeklyXP, getFlashcardAnalytics } from '@/app/lib/data/analytics';
import { auth } from '@/auth';
import { getQuizHistory } from '@/app/lib/data/quiz';
import { Suspense } from 'react';
import { StatsOverviewSkeleton } from '@/app/ui/skeleton/skeletons';
import { ChartSkeleton, QuizAttemptSkeleton, CardStatusSkeleton, SetMasterySkeleton } from '@/app/ui/skeleton/analytic';

export const metadata: Metadata = {
  title: "Analytics",
  description: "Dive into your Learning analytics. Visualize your weekly XP, quiz scores, flashcard mastery, and overall progress.",
  robots: { index: false, follow: false },
};
import { AnalyticsFlashcardDailyReviews } from '@/app/ui/analytics/flashcard-daily-reviews';
import { AnalyticsFlashcardCardStatus } from '@/app/ui/analytics/flashcard-card-status';
import { AnalyticsFlashcardSetMastery } from '@/app/ui/analytics/flashcard-set-mastery';
import { AnalyticsLessonStudy } from '@/app/ui/analytics/lesson-study';

export default async function Analytics() {
  const session = await auth();
  const userId = session?.user?.id;
  const quizHistory = userId ? await getQuizHistory(userId) : [];
  const stats = userId ? await getOverviewStats(userId) : [];
  const weeklyActivity = userId ? await getWeeklyActivity(userId) : [];
  const weeklyXP = userId ? await getWeeklyXP(userId) : [];
  const flashcardAnalytics = userId
    ? await getFlashcardAnalytics(userId)
    : { dailyReviews: [], cardStatus: [], setMastery: [], totalCards: 0 };

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Weekly Activity */}
            <Suspense fallback={<ChartSkeleton />}>
              <AnalyticsLessonStudy weeklyActivity={weeklyActivity} />
            </Suspense>

            {/* Subject Breakdown */}
            <Suspense fallback={<ChartSkeleton />}>
              <AnalyticsWeeklyXP weeklyXP={weeklyXP} />
            </Suspense>
          </div>

          {/* Flashcard Analytics */}
          <div className="space-y-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Suspense fallback={<ChartSkeleton />}>
                  <AnalyticsFlashcardDailyReviews dailyReviews={flashcardAnalytics.dailyReviews} />
                </Suspense>
              </div>
              <div className="lg:col-span-1">
                <Suspense fallback={<CardStatusSkeleton />}>
                  <AnalyticsFlashcardCardStatus
                    cardStatus={flashcardAnalytics.cardStatus}
                    totalCards={flashcardAnalytics.totalCards}
                  />
                </Suspense>
              </div>
            </div>

            <Suspense fallback={<SetMasterySkeleton />}>
              <AnalyticsFlashcardSetMastery setMastery={flashcardAnalytics.setMastery} />
            </Suspense>
          </div>

          {/* Quiz History */}
          <Suspense fallback={<QuizAttemptSkeleton />}>
            <QuizHistorySection attempts={quizHistory} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
