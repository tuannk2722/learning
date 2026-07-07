export const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';


export function TitleSection() {
  return (
    <div className="mt-20 mb-10">
      <div className="flex items-center gap-3">
        <div className={`${shimmer} p-3 rounded-xl bg-gray-200 w-12 h-12 relative overflow-hidden`} />
        <div className="space-y-2">
          <div className={`${shimmer} h-8 w-44 bg-gray-200 rounded-md relative overflow-hidden`} />
          <div className={`${shimmer} h-4 w-60 bg-gray-200 rounded-md relative overflow-hidden`} />
        </div>
      </div>
    </div>
  )
}

export function StatsOverviewCardSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 min-h-[160px]`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-16 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="mt-4 h-3 bg-gray-200 rounded-full w-full" />
    </div>
  );
}

export function StatsOverviewSkeleton() {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-12 relative overflow-hidden">
      <StatsOverviewCardSkeleton />
      <StatsOverviewCardSkeleton />
      <StatsOverviewCardSkeleton />
      <StatsOverviewCardSkeleton />
    </div>
  );
}

// ACHIEVEMENTS SKELETON
export function AchievementCardSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden`}>
      <div className="w-16 h-16 rounded-xl bg-gray-200 mb-4" />
      <div className="h-5 w-28 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-44 bg-gray-200 rounded mb-4" />
      <div className="flex justify-between items-center mt-2">
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function AchievementsSkeleton() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <TitleSection />

        {/* Progress Bar */}
        <div className={`${shimmer} bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8 relative overflow-hidden`}>
          <div className="flex justify-between items-center mb-3">
            <div className="h-5 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-10 bg-gray-200 rounded" />
          </div>
          <div className="h-3 bg-gray-100 rounded-full" />
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <AchievementCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// LEADERBOARD SKELETON
export function Top3PodiumSkeleton() {
  return (
    <div className={`${shimmer} grid grid-cols-3 gap-4 mb-12 relative overflow-hidden`}>
      {/* Second Place */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center pt-12 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 mb-3" />
        <div className="w-8 h-8 rounded-full bg-gray-200 mb-3" />
        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
        <div className="h-5 w-20 bg-gray-200 rounded" />
      </div>
      {/* First Place */}
      <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100 shadow-sm text-center flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 mb-3" />
        <div className="w-20 h-20 rounded-full bg-gray-200 mb-3" />
        <div className="h-5 w-28 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-24 bg-gray-200 rounded" />
      </div>
      {/* Third Place */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center pt-12 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 mb-3" />
        <div className="w-8 h-8 rounded-full bg-gray-200 mb-3" />
        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
        <div className="h-5 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function FullLeaderboardSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm relative`}>
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-gray-200 rounded-full" />
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="space-y-2 text-right flex flex-col items-end">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Title Section */}
        <TitleSection />

        {/* Top 3 Podium */}
        <Top3PodiumSkeleton />

        {/* Full Leaderboard */}
        <FullLeaderboardSkeleton />
      </div>
    </div>
  );
}

// PROFILE SKELETON
export function ProfileHeaderSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8 relative overflow-hidden`}>
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2 w-full">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded shrink-0 ml-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-36 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileStatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`${shimmer} bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden`}>
          <div className="w-8 h-8 rounded-lg bg-gray-200 mb-3" />
          <div className="h-6 w-16 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSettingSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden`}>
      <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-48 bg-gray-200 rounded" />
            </div>
            <div className="h-6 w-12 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Profile Title */}
        <TitleSection />

        {/* Profile Header */}
        <ProfileHeaderSkeleton />

        {/* Settings Section */}
        <ProfileSettingSkeleton />
      </div>
    </div>
  );
}

export function HistoryTimelineSkeleton() {
  return (
    <div className="space-y-12 relative">
      {/* Connecting Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100" />

      {[1, 2].map((group) => (
        <div key={group} className="relative">
          <div className={`${shimmer} h-4 w-24 bg-gray-200 rounded mb-6 ml-16 relative overflow-hidden`} />
          <div className="space-y-6">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-start gap-4 relative">
                <div className={`${shimmer} w-12 h-12 rounded-full bg-gray-200 shrink-0 z-10 relative overflow-hidden`} />
                <div className={`${shimmer} flex-1 bg-white rounded-xl p-4 border border-gray-100 shadow-sm min-h-[80px] relative overflow-hidden`}>
                  <div className="h-5 w-2/3 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
