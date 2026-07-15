'use client';

import { AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

interface SessionReplacedBannerProps {
  isSessionReplaced: boolean;
}

export function SessionReplacedBanner({ isSessionReplaced }: SessionReplacedBannerProps) {
  if (!isSessionReplaced) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6 bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm"
    >
      <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-amber-800">Session has been replaced</p>
        <p className="text-amber-700 text-sm mt-1">
          This lesson is being opened in another tab, so the learning time will be calculated in that tab.
        </p>
      </div>
    </motion.div>
  );
}
