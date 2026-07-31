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

export function CardStatusSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-3xl p-8 border-2 border-violet-100 shadow-lg relative overflow-hidden h-full flex flex-col justify-between`}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 bg-gray-200 rounded-md" />
          <div className="h-6 w-32 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-4 w-28 bg-gray-200 rounded mb-4" />
      </div>

      <div className="w-40 h-40 mx-auto my-2 rounded-full border-[18px] border-gray-200 shrink-0" />

      <div className="flex items-center justify-center gap-5 mt-2">
        <div className="h-4 w-16 bg-gray-200 rounded-full" />
        <div className="h-4 w-16 bg-gray-200 rounded-full" />
        <div className="h-4 w-16 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

export function SetMasterySkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-3xl p-8 border-2 border-violet-100 shadow-lg relative overflow-hidden`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 bg-gray-200 rounded-md" />
        <div className="h-6 w-44 bg-gray-200 rounded-lg" />
      </div>
      <div className="h-4 w-56 bg-gray-200 rounded mb-6" />

      <div className="space-y-5 pt-2">
        {[
          { labelWidth: 'w-32', barWidth: 'w-3/4' },
          { labelWidth: 'w-40', barWidth: 'w-1/2' },
          { labelWidth: 'w-28', barWidth: 'w-5/6' },
          { labelWidth: 'w-36', barWidth: 'w-2/5' },
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`h-4 ${item.labelWidth} bg-gray-200 rounded shrink-0`} />
            <div className="flex-1 h-6 bg-gray-100 rounded-r-lg overflow-hidden">
              <div className={`h-full ${item.barWidth} bg-gray-200 rounded-r-lg`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FlashcardAnalyticsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <div className="lg:col-span-1">
          <CardStatusSkeleton />
        </div>
      </div>
      <SetMasterySkeleton />
    </div>
  );
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Activity Chart Skeleton */}
          <ChartSkeleton />

          {/* Weekly XP Chart Skeleton */}
          <ChartSkeleton />
        </div>

        {/* Flashcard Analytics Skeleton */}
        <FlashcardAnalyticsSkeleton />

        {/* Quiz Attempt Skeleton */}
        <QuizAttemptSkeleton />
      </div>
    </div>
  );
}