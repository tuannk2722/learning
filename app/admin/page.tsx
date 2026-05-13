'use client';
import { motion } from 'motion/react';
import { Users, BookOpen, Trophy, TrendingUp, Award, Target, Zap, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '12,458', change: '+12.5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Users (DAU)', value: '3,245', change: '+8.3%', icon: Zap, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Courses Published', value: '156', change: '+6', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Badges Awarded', value: '8,942', change: '+23.1%', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Lessons Completed', value: '45,678', change: '+18.7%', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Avg. Study Time', value: '2.5h', change: '+15%', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
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

  const maxDAU = Math.max(...dailyActiveUsers.map(d => d.users));
  const maxLessons = Math.max(...lessonsCompleted.map(d => d.count));

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Platform overview and key metrics</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Active Users */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6">Daily Active Users</h2>

            <div className="flex items-end justify-between h-64 gap-3">
              {dailyActiveUsers.map((day, index) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end h-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.users / maxDAU) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg min-h-2"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">{day.day}</div>
                  <div className="text-xs font-medium">{day.users.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Lessons Completed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6">Lessons Completed</h2>

            <div className="flex items-end justify-between h-64 gap-3">
              {lessonsCompleted.map((day, index) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end h-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.count / maxLessons) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg min-h-2"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">{day.day}</div>
                  <div className="text-xs font-medium">{day.count}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6">Top Performing Courses</h2>

            <div className="space-y-4">
              {topCourses.map((course, index) => (
                <motion.div
                  key={course.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                >
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{course.name}</h3>
                    <p className="text-sm text-muted-foreground">{course.enrollments.toLocaleString()} enrollments</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">{course.completion}%</div>
                    <div className="text-xs text-muted-foreground">completion</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Badges Awarded */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-6">Recent Badges Awarded</h2>

            <div className="space-y-4">
              {recentBadges.map((item, index) => (
                <motion.div
                  key={item.badge}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.badge}</h3>
                      <p className="text-sm text-muted-foreground">{item.awarded} awarded</p>
                    </div>
                  </div>
                  <div className="text-sm text-green-600 font-medium">{item.trend}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
