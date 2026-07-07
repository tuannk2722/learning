'use client';

import { useEffect, useState } from "react";
import { Award, BookOpen, CheckCircle, Trophy, X, Zap } from "lucide-react";
import { motion } from "motion/react";
import { getUserDetailsAction } from "@/app/lib/actions/users";
import { DynamicIcon } from "../../dynamic-icon";

interface UserModalProps {
  userId: string | null;
  onClose: () => void;
}

const colorMap: Record<string, { bg: string; text: string }> = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
};

export default function UserModal({ userId, onClose }: UserModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setData(null);
      return;
    }

    setLoading(true);
    getUserDetailsAction(userId)
      .then((res) => {
        if (res) {
          setData(res);
        }
      })
      .catch((err) => {
        console.error("Error loading user profile:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Backdrop motion wrapper */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative z-10"
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold">
            {loading ? "Loading profile..." : `User Profile - ${data?.user?.name || ''}`}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-60 bg-gray-100 rounded-2xl" />
                  <div className="h-60 bg-gray-100 rounded-2xl" />
                </div>
                <div className="space-y-6">
                  <div className="h-44 bg-gray-200 rounded-2xl" />
                  <div className="h-40 bg-gray-100 rounded-2xl" />
                  <div className="h-40 bg-gray-100 rounded-2xl" />
                </div>
              </div>
            </div>
          ) : !data ? (
            <div className="py-12 text-center text-gray-500">
              Failed to load user profile details.
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Learning Progress */}
              <div className="lg:col-span-2 space-y-6">
                {/* Enrolled Courses */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold mb-4">Enrolled Courses</h4>
                  {data.enrolledCourses.length === 0 ? (
                    <p className="text-sm text-gray-500 italic py-6 text-center">
                      No enrolled courses yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {data.enrolledCourses.map((course: any, i: number) => (
                        <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-medium text-gray-900">{course.name}</div>
                              <div className="text-xs text-gray-500">{course.lessons} lessons completed</div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.status === "Completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                              }`}>
                              {course.status}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-violet-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-600 mt-1 text-right">{course.progress}%</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold mb-4">Recent Activity</h4>
                  {data.recentActivities.length === 0 ? (
                    <p className="text-sm text-gray-500 italic py-6 text-center">
                      No recent activities recorded.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {data.recentActivities.map((activity: any, i: number) => {
                        const colors = colorMap[activity.color] || colorMap.orange;
                        const IconComp = activity.icon === "CheckCircle" ? CheckCircle
                          : activity.icon === "Award" ? Award
                            : activity.icon === "BookOpen" ? BookOpen
                              : activity.icon === "Trophy" ? Trophy
                                : Zap;

                        return (
                          <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                              <IconComp className={`w-5 h-5 ${colors.text}`} />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{activity.action}</div>
                              <div className="text-sm text-gray-600">{activity.item}</div>
                              <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Achievements */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold mb-4">Achievements & Badges</h4>
                  {data.achievements.length === 0 ? (
                    <p className="text-sm text-gray-500 italic py-6 text-center">
                      No achievements definitions found.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {data.achievements.map((badge: any, i: number) => (
                        <div
                          key={i}
                          className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${badge.unlocked
                            ? "border-amber-200 bg-amber-50/50 shadow-sm"
                            : "border-gray-200 bg-gray-50 opacity-40"
                            }`}
                          title={badge.desc}
                        >
                          <div className="mb-2">
                            <DynamicIcon
                              name={badge.icon}
                              className={`w-8 h-8 ${badge.unlocked ? "text-amber-500" : "text-gray-400"}`}
                            />
                          </div>
                          <div className="text-xs font-semibold text-gray-950 line-clamp-1">{badge.name}</div>
                          <div className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{badge.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Stats & Info */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl p-6 text-white shadow-md">
                  <h4 className="text-lg font-bold mb-4">Learning Stats</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/20">
                      <span className="text-white/80">Current Level</span>
                      <span className="text-2xl font-bold">Level {data.user.level}</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/20">
                      <span className="text-white/80">Total XP</span>
                      <span className="text-2xl font-bold">{data.user.totalXp.toLocaleString()} XP</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Current Streak</span>
                      <span className="text-2xl font-bold">{data.user.streak} days</span>
                    </div>
                  </div>
                </div>

                {/* Study Time */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold mb-4">Study Time</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">This Week</span>
                      <span className="font-bold text-gray-900">{data.studyTime.thisWeek}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">This Month</span>
                      <span className="font-bold text-gray-900">{data.studyTime.thisMonth}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">All Time</span>
                      <span className="font-bold text-gray-900">{data.studyTime.allTime}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-600 mb-2">Daily Average (Active Days)</div>
                    <div className="text-2xl font-bold text-gray-900">{data.studyTime.dailyAverage}</div>
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold mb-4">Performance</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Quiz Average</span>
                        <span className="font-bold text-gray-900">{data.performance.quizAverage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${data.performance.quizAverage}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Participation (Completion)</span>
                        <span className="font-bold text-gray-900">{data.performance.participation}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-violet-500 h-2 rounded-full transition-all duration-500" style={{ width: `${data.performance.participation}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h4 className="text-lg font-bold mb-4">Account Info</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-medium text-gray-900">{data.user.joinedDate}</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <span className="text-gray-600">Last Active</span>
                      <span className="font-medium text-gray-900">{data.user.lastActive}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">User ID</span>
                      <span className="font-mono text-xs text-gray-900 select-all truncate max-w-[150px]" title={data.user.id}>
                        {data.user.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}