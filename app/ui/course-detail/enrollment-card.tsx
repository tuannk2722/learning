'use client';

import { CourseDetail } from "@/app/lib/definitions/courses";
import { CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { getColorClasses } from "@/app/lib/utils/color-palette";
import { enrollInCourse } from "@/app/lib/actions/course";
import { useState } from "react";
import { toast } from "sonner";
import { showAchievementToasts } from "../achievement/achievement-toast";

export function EnrollmentCard({ course }: { course: CourseDetail }) {
  const colorClasses = getColorClasses(course.theme_color);
  const [isPending, setIsPending] = useState(false);

  const handleEnroll = async () => {
    setIsPending(true);
    try {
      const result = await enrollInCourse(course.id);
      if (result.success) {
        toast.success(result.message || 'Successfully enrolled in course!');
        if (result.unlockedAchievements?.length) {
          showAchievementToasts(result.unlockedAchievements);
        }
      } else {
        toast.error(result.message || 'Failed to enroll');
      }
    } catch (error) {
      toast.error('An error occurred during enrollment');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-[99999] bg-white/10 backdrop-blur-sm cursor-wait" />
      )}

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-violet-100 h-fit sticky top-24"
      >
        {course.is_enrolled ? (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Total Progress</span>
                <span className="text-sm font-bold text-gray-900">{course.progress_percent}%</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full bg-gradient-to-r ${colorClasses.gradient} rounded-full`}
                  style={{ width: `${course.progress_percent}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">
                {course.completed_lessons || 0}/{course.total_lessons} lessons completed
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-violet-50 rounded-2xl p-4">
                <div className="text-sm text-gray-600 mb-1">XP Earned</div>
                <div className="text-2xl font-bold text-violet-600">{course.xp_earned || 0}</div>
              </div>
              <div className="bg-violet-50 rounded-2xl p-4">
                <div className="text-sm text-gray-600 mb-1">Time Spent</div>
                <div className="text-2xl font-bold text-violet-600">
                  {Math.floor((course.learned_minutes || 0) / 60)}h {(course.learned_minutes || 0) % 60}m
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">Free</div>
              <div className="text-sm text-gray-600">Start learning today</div>
            </div>

            <button
              onClick={handleEnroll}
              disabled={isPending}
              className={`w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-400 text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all mb-3 disabled:opacity-70 disabled:cursor-not-allowed`}>
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enrolling...
                </>
              ) : (
                'Enroll in Course'
              )}
            </button>

            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Lifetime access</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Completion certificate</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Learning community</span>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </>
  )
}