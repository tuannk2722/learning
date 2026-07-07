import { LeaderboardTitle } from "@/app/ui/leaderboard/title";
import { Top3Podium } from "@/app/ui/leaderboard/top-3-podium";
import { FullLeaderboard } from "@/app/ui/leaderboard/full-leaderboard";
import { Suspense } from "react";
import { Top3PodiumSkeleton, FullLeaderboardSkeleton } from "@/app/ui/skeletons";

import { getLeaderboardData } from "@/app/lib/data/users";
import { auth } from "@/auth";

export default async function Leaderboard() {
  const session = await auth();
  const userId = session?.user?.id;
  
  const leaderboardData = await getLeaderboardData(userId);


  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Title Section */}
        <LeaderboardTitle />

        {/* Top 3 Podium */}
        <Suspense fallback={<Top3PodiumSkeleton />}>
          <Top3Podium leaderboardData={leaderboardData.slice(0, 3)} />
        </Suspense>

        {/* Full Leaderboard */}
        <Suspense fallback={<FullLeaderboardSkeleton />}>
          <FullLeaderboard leaderboardData={leaderboardData} />
        </Suspense>
      </div>
    </div>
  );
}
