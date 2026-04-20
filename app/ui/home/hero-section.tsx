import { ArrowRight, Crown, Sparkles, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const stats = [
  { value: '10K+', label: 'Active Learners' },
  { value: '500+', label: 'Courses' },
  { value: '95%', label: 'Success Rate' },
  { value: '4.9/5', label: 'User Rating' },
];

export function HeroSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Learn Smarter, Not Harder</span>
          </div>

          <h1 className="text-6xl mb-6 leading-tight">
            Master Any Subject with{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Gamified Learning
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Transform your study routine with interactive courses, personalized roadmaps,
            and powerful analytics. Join thousands of learners achieving their goals.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-lg hover:shadow-xl transition-shadow"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl text-lg hover:border-gray-400 transition-colors"
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
            {/* Mock Dashboard Preview */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-medium">Alex Chen</div>
                    <div className="text-sm text-muted-foreground">Level 12 • 2,340 XP</div>
                  </div>
                </div>
                <Crown className="w-8 h-8 text-yellow-500" />
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
                <div className="text-sm mb-2 opacity-80">Daily Progress</div>
                <div className="text-3xl font-bold mb-4">78%</div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">23</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">127h</div>
                  <div className="text-xs text-muted-foreground">Study Time</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">45</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            className="text-center"
          >
            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {stat.value}
            </div>
            <div className="text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}