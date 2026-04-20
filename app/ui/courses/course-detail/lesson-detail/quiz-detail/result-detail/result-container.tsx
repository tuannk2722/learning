"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Trophy, Star, Target, TrendingUp, CheckCircle2, XCircle, Zap, ChevronRight, RotateCcw, Award } from "lucide-react";
import confetti from 'canvas-confetti';
import ResultDetailCard from "./result-detail-card";

interface Props {
  courseId: string;
  lessonId: string;
  score: number;
  total: number;
  results: any[];
}

export default function QuizResultsContainer({ courseId, lessonId, score, total, results }: Props) {
  const [showConfetti, setShowConfetti] = useState(false);

  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 70;
  const xpEarned = passed ? 500 : Math.round(500 * (percentage / 100));

  useEffect(() => {
    if (passed && !showConfetti) {
      setShowConfetti(true);
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#8B5CF6', '#A78BFA'] });
        confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#8B5CF6', '#A78BFA'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [passed, showConfetti]);

  const getRank = () => {
    if (percentage >= 90) return { title: "Excellent!", icon: Trophy, color: "from-yellow-500 to-orange-500" };
    if (percentage >= 80) return { title: "Very good!", icon: Star, color: "from-violet-500 to-purple-500" };
    if (percentage >= 70) return { title: "Good!", icon: Target, color: "from-blue-500 to-cyan-500" };
    return { title: "Need to improve", icon: TrendingUp, color: "from-gray-500 to-gray-600" };
  };

  const rank = getRank();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${passed ? "from-violet-600 to-purple-600" : "from-slate-700 to-slate-800"} rounded-[2.5rem] p-10 text-white shadow-xl mb-10 text-center relative overflow-hidden`}
      >
        <rank.icon className="w-20 h-20 mx-auto mb-6 text-white/90" />
        <h1 className="text-5xl font-extrabold mb-2 tracking-tight">{rank.title}</h1>
        <p className="text-xl text-violet-100/80 mb-8">You answered {score}/{total} questions correctly</p>

        <div className="flex items-center justify-center gap-10 mb-8">
          <div className="text-center">
            <div className="text-5xl font-black">{percentage}%</div>
            <div className="text-xs uppercase tracking-widest text-violet-200/60 mt-1">Correct</div>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="text-center">
            <div className="text-5xl font-black flex items-center justify-center gap-2">
              <Zap className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              +{xpEarned}
            </div>
            <div className="text-xs uppercase tracking-widest text-violet-200/60 mt-1">Experience</div>
          </div>
        </div>

        <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-sm font-semibold`}>
          {passed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {passed ? "Passed!" : "Failed!"}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <StatBox label="Correct" value={score} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
        <StatBox label="Incorrect" value={total - score} icon={XCircle} color="text-red-600" bg="bg-red-50" />
        <StatBox label="Status" value={percentage >= 70 ? "Passed" : "Failed"} icon={Award} color="text-violet-600" bg="bg-violet-50" />
      </div>

      {/* Detailed Analysis */}
      <div className="space-y-4 mb-10">
        <h2 className="text-xl font-bold text-gray-800 ml-2 mb-4">Detailed Analysis</h2>
        {results.map((res, idx) => (
          <ResultDetailCard key={idx} result={res} index={idx} />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {!passed && (
          <Link href={`/dashboard/courses/${courseId}/lesson/${lessonId}/quiz`}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-violet-200 text-violet-700 font-bold hover:bg-violet-50 transition-all flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" /> Try again
          </Link>
        )}
        <Link href={`/dashboard/courses/${courseId}`}
          className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-violet-600 text-white font-bold hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all flex items-center justify-center gap-2">
          {passed ? "Next lesson" : "Back to course"} <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className={`${bg} p-6 rounded-3xl border border-black/5`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
    </div>
  )
}