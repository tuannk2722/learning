import { motion } from "motion/react";
import { Zap } from "lucide-react";

interface QuizHeaderProps {
  xpReward: number;
  currentQuestion: number;
  totalQuestions: number;
}

export default function QuizHeader({ xpReward, currentQuestion, totalQuestions }: QuizHeaderProps) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-violet-100 p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-100">
          <Zap className="w-4 h-4" />
          <span className="font-bold">+{xpReward} XP</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500">Progress:</span>
        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-bold text-violet-700">{currentQuestion + 1}/{totalQuestions}</span>
      </div>
    </div>
  );
}
