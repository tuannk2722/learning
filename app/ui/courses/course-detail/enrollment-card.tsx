'use client';

import { Course } from "@/app/lib/definitions/definitions";
import { Award, CheckCircle2, Play } from "lucide-react";
import { motion } from "motion/react";


// Mock user progress for this course
const userProgress = {
  enrolled: true,
  completedLessons: 42,
  currentLesson: 43,
  progressPercentage: 42,
  totalTimeSpent: 1847, // minutes
  xpEarned: 8400
};

export function EnrollmentCard({ course }: { course: Course }) {

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-violet-100 h-fit sticky top-24"
    >
      {userProgress.enrolled ? (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Total Progress</span>
              <span className="text-sm font-bold text-gray-900">{userProgress.progressPercentage}%</span>
            </div>
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${course.color} rounded-full`}
                style={{ width: `${userProgress.progressPercentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {userProgress.completedLessons}/{course.lessons} lessons completed
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-violet-50 rounded-2xl p-4">
              <div className="text-sm text-gray-600 mb-1">XP Earned</div>
              <div className="text-2xl font-bold text-violet-600">{userProgress.xpEarned}</div>
            </div>
            <div className="bg-violet-50 rounded-2xl p-4">
              <div className="text-sm text-gray-600 mb-1">Time Spent</div>
              <div className="text-2xl font-bold text-violet-600">
                {Math.floor(userProgress.totalTimeSpent / 60)}h
              </div>
            </div>
          </div>

          <button className={`w-full py-4 rounded-xl bg-gradient-to-r ${course.color} text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all mb-3`}>
            <Play className="w-5 h-5" />
            Continue Learning
          </button>
        </>
      ) : (
        <>
          <div className="mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-2">Free</div>
            <div className="text-sm text-gray-600">Start learning today</div>
          </div>

          <button className={`w-full py-4 rounded-xl bg-gradient-to-r ${course.color} text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all mb-3`}>
            Enroll in Course
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

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-bold text-gray-900">Rewards for Completion:</span>
        </div>
        <ul className="text-sm text-gray-600 space-y-1 ml-7">
          <li>• {course.xp.toLocaleString('en-US')} XP</li>
          <li>• 5 exclusive badges</li>
          <li>• {course.name} certificate</li>
        </ul>
      </div>
    </motion.div>
  )
}