import { BarChart3, BookOpen, Brain, Target, TrendingUp, Trophy, Users } from "lucide-react";
import { motion } from "motion/react";


export function HIWSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">How it work</h2>
          <p className="text-xl text-gray-600">Learning has never been simpler and more fun</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: BookOpen,
              title: "Choose a Course",
              description: "Explore hundreds of courses designed like games",
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: Target,
              title: "Complete Tasks",
              description: "Solve challenges and complete exercises",
              color: "from-violet-500 to-purple-500"
            },
            {
              icon: Trophy,
              title: "Earn Rewards",
              description: "Collect XP, badges, and unlock achievements",
              color: "from-yellow-500 to-orange-500"
            },
            {
              icon: TrendingUp,
              title: "Level Up",
              description: "Climb the leaderboard and become a master",
              color: "from-emerald-500 to-teal-500"
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative"
            >
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < 3 && (
                <div className="hidden md:block absolute top-10 -right-4 text-4xl text-violet-200">→</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}