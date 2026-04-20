'use client'
import { BookOpen, Sparkles, Trophy } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function LoginBranding() {
  
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
        Wellcome back<br />
        {/* <span className="text-yellow-300">người học!</span> */}
      </h1>
      <p className="text-xl text-violet-100 mb-8">
        Continue your journey of mastering knowledge and climb the leaderboard alongside thousands of other learners.
      </p>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold">500K+ learners</div>
            <div className="text-sm text-violet-100">are learning every day</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold">10M+ lessons</div>
            <div className="text-sm text-violet-100">completed</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}