import { shimmer, StatsOverviewSkeleton, TitleSection } from "./skeletons";

export function QuizAttemptSkeleton() {
  return (
    <div className={`${shimmer} mt-8 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden`}>
      <div className="h-7 w-48 bg-gray-200 rounded mb-6" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-6 w-16 bg-gray-200 rounded-full shrink-0" />
              <div className="h-5 w-12 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-[400px] relative overflow-hidden`}>
      <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
      <div className="flex items-end justify-between h-64 px-4 pb-2 border-b border-gray-100">
        {[60, 80, 45, 90, 30, 70, 50].map((height, i) => (
          <div key={i} className="w-8 bg-gray-200 rounded-t-lg" style={{ height: `${height}%` }} />
        ))}
      </div>
    </div>
  )
}

export function AnalyticsSkeleton() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <TitleSection />

        {/* Stats Grid Skeleton */}
        <StatsOverviewSkeleton />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Activity Chart Skeleton */}
          <ChartSkeleton />

          {/* Weekly XP Chart Skeleton */}
          <ChartSkeleton />
        </div>

        {/* Quiz Attempt Skeleton */}
        <QuizAttemptSkeleton />
      </div>
    </div>
  );
}