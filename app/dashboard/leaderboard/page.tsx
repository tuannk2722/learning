import { LeaderboardTitle } from "@/app/ui/leaderboard/title";
import { Top3Podium } from "@/app/ui/leaderboard/top-3-podium";
import { FullLeaderboard } from "@/app/ui/leaderboard/full-leaderboard";
import { Suspense } from "react";
import { Top3PodiumSkeleton, FullLeaderboardSkeleton } from "@/app/ui/skeletons";

export default function Leaderboard() {
  const leaderboardData = [
    { rank: 1, name: 'Alex Chen', level: 18, xp: 5240, streak: 45, trend: 'same', avatar: 'AC' },
    { rank: 2, name: 'Sarah Johnson', level: 17, xp: 4980, streak: 32, trend: 'up', avatar: 'SJ' },
    { rank: 3, name: 'Michael Kim', level: 16, xp: 4560, streak: 28, trend: 'down', avatar: 'MK' },
    { rank: 4, name: 'Emma Wilson', level: 15, xp: 4120, streak: 38, trend: 'up', avatar: 'EW' },
    { rank: 5, name: 'You', level: 12, xp: 2340, streak: 23, trend: 'up', isCurrentUser: true, avatar: 'YO' },
    { rank: 6, name: 'David Lee', level: 11, xp: 2180, streak: 15, trend: 'down', avatar: 'DL' },
    { rank: 7, name: 'Lisa Brown', level: 10, xp: 1950, streak: 20, trend: 'same', avatar: 'LB' },
    { rank: 8, name: 'James Miller', level: 10, xp: 1820, streak: 12, trend: 'up', avatar: 'JM' },
    { rank: 9, name: 'Maria Garcia', level: 9, xp: 1650, streak: 18, trend: 'same', avatar: 'MG' },
    { rank: 10, name: 'Ryan Taylor', level: 9, xp: 1580, streak: 14, trend: 'down', avatar: 'RT' },
  ];

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
