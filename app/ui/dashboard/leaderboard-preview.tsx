import { TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const topLearners = [
    { name: "Trần Thị B", level: 28, xp: 125000, avatar: "🏆" },
    { name: "Lê Văn C", level: 26, xp: 118000, avatar: "🥈" },
    { name: "Phạm Thị D", level: 24, xp: 112000, avatar: "🥉" },
    { name: "Nguyễn Văn A", level: 15, xp: 45000, avatar: "👤", isCurrentUser: true }
  ];

export function LeaderboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.1 }}
      className="bg-white rounded-3xl p-6 shadow-lg border-2 border-violet-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-violet-600" />
          <h3 className="text-xl font-bold">Leaderboard</h3>
        </div>
        <Link href="/leaderboard" className="text-sm text-violet-600 hover:text-violet-700">
          View Full
        </Link>
      </div>

      <div className="space-y-3">
        {topLearners.map((learner, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-2xl ${learner.isCurrentUser
              ? "bg-gradient-to-r from-violet-100 to-purple-100 border-2 border-violet-300"
              : "bg-gray-50"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{learner.avatar}</div>
              <div>
                <div className={`font-bold ${learner.isCurrentUser ? "text-violet-700" : "text-gray-900"}`}>
                  {learner.name}
                </div>
                <div className="text-sm text-gray-600">Level {learner.level}</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-700">
              {learner.xp.toLocaleString('en-US')} XP
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}