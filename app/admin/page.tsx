import StatCards from '@/app/ui/admin/dashboard/stat-cards';
import ActiveUsersChart from '@/app/ui/admin/dashboard/active-users-chart';
import LessonsCompletedChart from '@/app/ui/admin/dashboard/lessons-completed-chart';
import TopCourses from '@/app/ui/admin/dashboard/top-courses';
import RecentBadges from '@/app/ui/admin/dashboard/recent-badges';
import { getAdminDashboardData } from '@/app/lib/data/analytics';
import { EnrollmentTrends } from '../ui/admin/dashboard/enrollment-trends';

export default async function AdminDashboard() {
  const { stats, dailyActiveUsers, weeklyLessons, topCourses, topAchievements, enrollmentTrends } =
    await getAdminDashboardData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-5 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent font-bold">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Platform overview and key metrics</p>
          </div>

          {/* Stats Grid */}
          <StatCards stats={stats} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ActiveUsersChart data={dailyActiveUsers} />
            <LessonsCompletedChart data={weeklyLessons} />
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <EnrollmentTrends data={enrollmentTrends} />
            <RecentBadges data={topAchievements} />
          </div>

          <TopCourses data={topCourses} />

        </div>
      </div>
    </div>
  );
}
