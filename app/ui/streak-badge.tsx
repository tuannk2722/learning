import { motion } from "motion/react";

export default function AnimatedStreakBadge({ streak }: { streak: number }) {
  if (streak === 0) return null;

  return (
    <motion.div
      key={streak}
      initial={{ scale: 1.5, rotate: -10, filter: 'brightness(1.5)' }}
      animate={{ scale: 1, rotate: 0, filter: 'brightness(1)' }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      className="flex items-center gap-1.5 bg-gradient-to-r from-orange-50 to-red-50 px-3 py-1 rounded-full border border-orange-200 shadow-sm cursor-help"
      title={`${streak} days streak`}
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-orange-500 font-bold drop-shadow-sm"
      >
        🔥
      </motion.span>
      <span className="text-sm font-extrabold text-orange-600">{streak}</span>
    </motion.div>
  );
};