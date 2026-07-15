'use client';

import { Clock } from "lucide-react";
import { motion } from "motion/react";

interface LessonProgressBarProps {
  isCompleted: boolean;
  isAlreadyCompleted: boolean;
  requiredSeconds: number;
  accumulatedSeconds: number;
  isSessionReplaced: boolean;
}

export function LessonProgressBar({
  isCompleted,
  isAlreadyCompleted,
  requiredSeconds,
  accumulatedSeconds,
  isSessionReplaced,
}: LessonProgressBarProps) {
  // Không hiển thị nếu đã hoàn thành, hoặc chưa khởi tạo session, hoặc session bị replace
  if (isCompleted || isAlreadyCompleted || requiredSeconds <= 0 || isSessionReplaced) {
    return null;
  }

  const progressPercent = Math.min((accumulatedSeconds / requiredSeconds) * 100, 100);
  const remainingSeconds = Math.max(0, requiredSeconds - accumulatedSeconds);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-white rounded-2xl p-5 shadow-lg border-2 border-violet-100/70"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-violet-700">
          <Clock className="w-4 h-4" />
          <span>Thời gian yêu cầu</span>
        </div>
        <span className="text-sm font-bold text-violet-600">
          {remainingSeconds > 0
            ? `Còn lại ${formatTime(remainingSeconds)}`
            : 'Đã hoàn thành!'}
        </span>
      </div>

      <div className="h-3 bg-violet-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
        <span>{formatTime(accumulatedSeconds)}</span>
        <span>{formatTime(requiredSeconds)}</span>
      </div>
    </motion.div>
  );
}
