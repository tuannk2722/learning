import { Award, Crown, Flame, Link, Target } from "lucide-react";
import { motion } from "motion/react";

const recentAchievements = [
  { icon: Flame, title: "Week Warrior", description: "7 days streak", gradient: "from-orange-500 to-red-500" },
  { icon: Target, title: "Quest Master", description: "100 quests completed", gradient: "from-violet-500 to-purple-500" },
  { icon: Crown, title: "Gold Rank", description: "Reach Gold rank", gradient: "from-yellow-500 to-amber-500" }
];

export function AchievementsCard() {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="bg-white rounded-3xl p-6 shadow-lg border-2 border-violet-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-violet-600" />
          <h3 className="text-xl font-bold">Recent Achievements</h3>
        </div>
        <Link href="/achievements" className="text-sm text-violet-600 hover:text-violet-700">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {recentAchievements.map((achievement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.gradient} flex items-center justify-center shadow-lg`}>
              <achievement.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900">{achievement.title}</div>
              <div className="text-sm text-gray-600">{achievement.description}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}