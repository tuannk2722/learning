'use client';
import { Crown, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import confetti from "canvas-confetti";

interface SuccessStepProps {
  nickname: string;
  avatarUrl: string;
  onFinish: () => void;
}

export function SuccessStep({ nickname, avatarUrl, onFinish }: SuccessStepProps) {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center h-full pt-6"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-violet-400 blur-[60px] opacity-20 rounded-full" />
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 15, delay: 0.2 }}
          className="w-36 h-36 bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 rounded-3xl flex items-center justify-center border-4 border-white shadow-2xl relative z-10 rotate-3 overflow-hidden"
        >
          <img src={avatarUrl} alt="Your Avatar" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <Crown className="w-12 h-12 text-white/50" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="absolute -bottom-4 -right-4 bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-xl border-2 border-white shadow-xl z-20 flex items-center gap-1"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          +100 XP
        </motion.div>
      </div>

      <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
        Welcome, {nickname}!
      </h2>
      <p className="text-lg text-gray-600 mb-10 max-w-md">
        Your profile is ready. You've earned the <b>Explorer Started</b> and 100 XP to start your learning journey.
      </p>

      <button
        onClick={onFinish}
        className="w-full max-w-xs py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-1 relative z-30"
      >
        Start learning now
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}
