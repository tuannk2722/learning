import { AnalyticsStatsGrid } from '@/app/ui/analytics/stats-grid';
import { AnalyticsSubjectbreakdown } from '@/app/ui/analytics/subject-breakdown';
import { AnalyticsTitle } from '@/app/ui/analytics/title';
import { AnalyticsWeeklyActivity } from '@/app/ui/analytics/weekly-activity';

export default function Analytics() {
  const stats = [
    { label: 'This week', value: 4320, change: '+12%', icon: 'zap', color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Lessons', value: 12, change: '+5%', icon: 'book-open', color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Study Time', value: '12.5', change: '+18%', icon: 'clock', color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Average Score', value: '92%', change: '+3%', icon: 'target', color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const weeklyActivity = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 3.2 },
    { day: 'Thu', hours: 2.1 },
    { day: 'Fri', hours: 2.8 },
    { day: 'Sat', hours: 10.0 },
    { day: 'Sun', hours: 3.8 },
  ];

  const subjectBreakdown = [
    { subject: 'Mathematics', percentage: 35, color: 'bg-blue-500', hours: 44 },
    { subject: 'Physics', percentage: 28, color: 'bg-purple-500', hours: 36 },
    { subject: 'Chemistry', percentage: 22, color: 'bg-green-500', hours: 28 },
    { subject: 'History', percentage: 15, color: 'bg-orange-500', hours: 19 },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <AnalyticsTitle />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            return <AnalyticsStatsGrid key={stat.label} stat={stat} index={index} />;
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Activity */}
          <AnalyticsWeeklyActivity weeklyActivity={weeklyActivity} />

          {/* Subject Breakdown */}
          <AnalyticsSubjectbreakdown subjectBreakdown={subjectBreakdown} />
        </div>
      </div>
    </div>
  );
}
