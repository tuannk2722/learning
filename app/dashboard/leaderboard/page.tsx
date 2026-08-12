import type { Metadata } from "next";
import { LeaderboardTitle } from "@/app/ui/leaderboard/title";
import { Top3Podium } from "@/app/ui/leaderboard/top-3-podium";
import { FullLeaderboard } from "@/app/ui/leaderboard/full-leaderboard";
import { Suspense } from "react";
import { Top3PodiumSkeleton, FullLeaderboardSkeleton } from "@/app/ui/skeleton/skeletons";

import { getLeaderboardData } from "@/app/lib/data/users";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "See the top learners on Learning. Compete with other students, track your rank, and climb to the top of the leaderboard.",
  keywords: ["leaderboard", "rankings", "learning competition", "top students"],
};

export default async function Leaderboard() {
  const session = await auth();
  const userId = session?.user?.id;

  const leaderboardData = await getLeaderboardData(userId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-5 pb-12 px-6">
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
    </div>
  );
}
