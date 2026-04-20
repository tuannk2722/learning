'use client';

import { motion } from "motion/react";
import { Trophy, User } from "lucide-react";
import Link from "next/link";
import { StatsOverview } from "../ui/dashboard/stats-overview";
import { DailyQuests } from "../ui/dashboard/daily-quests";
import { ContinueCourses } from "../ui/dashboard/continue-courses";
import { AchievementsCard } from "../ui/dashboard/achievements";
import { LeaderboardPreview } from "../ui/dashboard/leaderboard-preview";
import SideNav from "../ui/dashboard/sidenav";

export default function DashboardHome() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Navigation */}
      <SideNav />

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Nguyen Khac Tuan!</span>
            </h1>
            <p className="text-xl text-gray-600">Continue your journey of conquering knowledge</p>
          </motion.div>

          {/* Stats Overview */}
          <StatsOverview />

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Daily Quests & Continuing Courses */}
            <div className="lg:col-span-2 space-y-8">
              {/* Daily Quests */}
              <DailyQuests />

              {/* Continuing Courses */}
              <ContinueCourses />
            </div>

            {/* Right Column - Achievements & Leaderboard */}
            <div className="space-y-8">
              {/* Recent Achievements */}
              <AchievementsCard />

              {/* Leaderboard Preview */}
              <LeaderboardPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
