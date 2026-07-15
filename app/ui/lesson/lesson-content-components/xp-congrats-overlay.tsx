'use client';

import { AnimatePresence, motion } from "motion/react";

interface XpCongratsOverlayProps {
  show: boolean;
  xpAmount: number;
}

export function XpCongratsOverlay({ show, xpAmount }: XpCongratsOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          {/* Radial glow background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-80 h-80 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-violet-500/20 to-transparent rounded-full blur-3xl"
          />

          {/* XP Animation floating up */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.6 }}
            animate={{ opacity: 1, y: -30, scale: 1.3 }}
            exit={{ opacity: 0, y: -90, scale: 0.8 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="relative font-black text-5xl text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]"
          >
            +{xpAmount} XP
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
