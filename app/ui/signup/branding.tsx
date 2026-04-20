'use client';
import { BookOpen, Crown, Star, Target, Trophy } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function SignUpBranding() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="text-white hidden lg:block"
    >
      <Link href="/" className="flex items-center gap-3 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <span className="text-4xl font-bold">Gamified Learning</span>
      </Link>

      <h1 className="text-5xl font-bold mb-6 leading-tight">
        Start your<br />
        <span className="text-yellow-300">learning journey!</span>
      </h1>
      <p className="text-xl text-violet-100 mb-8">
        Join a community of  +500,000 learners who are conquering knowledge every day.
      </p>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold">Leveling system</div>
            <div className="text-sm text-violet-100">Climb from Beginner to Legend</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold">Daily tasks</div>
            <div className="text-sm text-violet-100">Earn XP and special rewards</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold">100+ Badges</div>
            <div className="text-sm text-violet-100">Collect and showcase achievements</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}