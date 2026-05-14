import StatCards from '@/app/ui/admin/dashboard/stat-cards';
import ActiveUsersChart from '@/app/ui/admin/dashboard/active-users-chart';
import LessonsCompletedChart from '@/app/ui/admin/dashboard/lessons-completed-chart';
import TopCourses from '@/app/ui/admin/dashboard/top-courses';
import RecentBadges from '@/app/ui/admin/dashboard/recent-badges';

export default async function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '12,458', change: '+12.5%', icon: "users", color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Users (DAU)', value: '3,245', change: '+8.3%', icon: "zap", color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Courses Published', value: '156', change: '+6', icon: "book-open", color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Badges Awarded', value: '8,942', change: '+23.1%', icon: "trophy", color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Lessons Completed', value: '45,678', change: '+18.7%', icon: "target", color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Avg. Study Time', value: '2.5h', change: '+15%', icon: "clock", color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const dailyActiveUsers = [
    { day: 'Mon', users: 2800 },
    { day: 'Tue', users: 3100 },
    { day: 'Wed', users: 2950 },
    { day: 'Thu', users: 3350 },
    { day: 'Fri', users: 3200 },
    { day: 'Sat', users: 2400 },
    { day: 'Sun', users: 2100 },
  ];

  const lessonsCompleted = [
    { day: 'Mon', count: 420 },
    { day: 'Tue', count: 480 },
    { day: 'Wed', count: 445 },
    { day: 'Thu', count: 520 },
    { day: 'Fri', count: 490 },
    { day: 'Sat', count: 380 },
    { day: 'Sun', count: 320 },
  ];

  const topCourses = [
    { name: 'Advanced Calculus', enrollments: 1234, completion: 68, color: 'bg-blue-500' },
    { name: 'Quantum Physics', enrollments: 892, completion: 72, color: 'bg-purple-500' },
    { name: 'Organic Chemistry', enrollments: 2156, completion: 85, color: 'bg-green-500' },
    { name: 'World History', enrollments: 3421, completion: 45, color: 'bg-orange-500' },
  ];

  const recentBadges = [
    { badge: 'Perfect Week', awarded: 145, trend: '+12%' },
    { badge: '7 Day Streak', awarded: 234, trend: '+8%' },
    { badge: 'Quiz Master', awarded: 89, trend: '+15%' },
    { badge: 'Speed Learner', awarded: 167, trend: '+10%' },
  ];

  return (
    <div className="p-6">
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
          <LessonsCompletedChart data={lessonsCompleted} />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TopCourses data={topCourses} />
          <RecentBadges data={recentBadges} />
        </div>
      </div>
    </div>
  );
}
