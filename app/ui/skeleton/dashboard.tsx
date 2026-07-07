import { shimmer, StatsOverviewSkeleton } from "./skeletons";

export function HeaderDashboardSkeleton() {
  return (
    <div className="mb-12">
      <div className={`${shimmer} h-10 w-96 rounded-md bg-gray-200 mb-3`} />
      <div className={`${shimmer} h-6 w-72 rounded-md bg-gray-200`} />
    </div>
  );
}

export function DailyQuestsSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-200" />
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 w-full">
                <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-4 w-8 bg-gray-200 rounded shrink-0" />
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeaderboardPreviewSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200" />
          <div className="h-6 w-32 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-12 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContinueCoursesSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-200" />
          <div className="h-6 w-48 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-5 w-48 bg-gray-200 rounded" />
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full" />
            <div className="h-3 w-24 bg-gray-200 rounded mt-2" />
          </div>
        ))}
      </div>
      <div className="mt-6 w-full py-3 h-12 rounded-xl bg-gray-200" />
    </div>
  );
}

export function AchievementsCardSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200" />
          <div className="h-6 w-40 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50">
            <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="pt-5 pb-12 px-6 w-full">
      <div className="max-w-7xl mx-auto">
        <HeaderDashboardSkeleton />
        <StatsOverviewSkeleton />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DailyQuestsSkeleton />
            <ContinueCoursesSkeleton />
          </div>
          <div className="space-y-8">
            <AchievementsCardSkeleton />
            <LeaderboardPreviewSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}