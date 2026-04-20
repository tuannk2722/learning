import { motion } from "motion/react";
import { CheckCircle2, Target } from "lucide-react";

const recentActivity = [
  { subject: 'Mathematics', duration: 45, completed: true },
  { subject: 'Physics', duration: 30, completed: true },
  { subject: 'Chemistry', duration: 60, completed: true },
];

export default function Recent_Activity() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5" />
        <h3 className="text-xl">Recent Activity</h3>
      </div>

      <div className="space-y-3">
        {recentActivity.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="font-medium">{activity.subject}</div>
                <div className="text-sm text-muted-foreground">{activity.duration} minutes</div>
              </div>
            </div>
            <div className="text-sm text-green-600">+{activity.duration} XP</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}