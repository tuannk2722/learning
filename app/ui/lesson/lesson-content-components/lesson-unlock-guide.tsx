'use client';

import { useState } from "react";
import { Info, Clock, Eye, Monitor, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface LessonUnlockGuideProps {
  durationMinutes: number;
}

export function LessonUnlockGuide({ durationMinutes }: LessonUnlockGuideProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mb-6 bg-violet-50 border border-violet-200 rounded-2xl overflow-hidden"
    >
      {/* Trigger row */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-violet-100 transition-colors text-left"
      >
        <Info className="w-4 h-4 text-violet-500 flex-shrink-0" />
        <span className="flex-1 text-sm font-semibold text-violet-700">
          How to unlock the next lesson
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown className="w-4 h-4 text-violet-400" />
        </motion.span>
      </button>

      {/* Collapsible detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="guide-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <ul className="px-5 pb-4 pt-1 space-y-2.5 text-sm text-violet-700 border-t border-violet-200">
              <li className="flex items-start gap-2.5 pt-3">
                <Clock className="w-3.5 h-3.5 flex-shrink-0 text-violet-500 mt-0.5" />
                <span>
                  Stay on this page for at least{" "}
                  <span className="font-bold">
                    {durationMinutes} minute{durationMinutes !== 1 ? "s" : ""}
                  </span>{" "}
                  to complete this lesson.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Eye className="w-3.5 h-3.5 flex-shrink-0 text-violet-500 mt-0.5" />
                <span>Time is only counted while this tab is <span className="font-bold">active and in focus</span>.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Monitor className="w-3.5 h-3.5 flex-shrink-0 text-violet-500 mt-0.5" />
                <span>Switching tabs or minimizing the window will <span className="font-bold">pause</span> the timer.</span>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
