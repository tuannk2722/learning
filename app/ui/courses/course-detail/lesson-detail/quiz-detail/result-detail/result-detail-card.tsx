"use client";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";

export default function ResultDetailCard({ result, index }: { result: any; index: number }) {
  const isCorrect = result.isCorrect;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-6 rounded-3xl border-2 transition-all ${isCorrect ? "bg-white border-emerald-100" : "bg-white border-red-100"
        }`}
    >
      <div className="flex gap-4">
        <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
          }`}>
          {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Question {index + 1}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              }`}>
              {isCorrect ? "Correct" : "Incorrect"}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-4 leading-tight">{result.question}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Your answer</div>
              <div className={`text-sm font-semibold ${isCorrect ? "text-emerald-700" : "text-red-700"}`}>
                {result.userAnswer}
              </div>
            </div>
            {!isCorrect && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Correct answer</div>
                <div className="text-sm font-semibold text-emerald-700">{result.correctAnswer}</div>
              </div>
            )}
          </div>

          <div className="flex gap-3 p-4 bg-violet-50/50 rounded-2xl border border-violet-100">
            <Lightbulb className="w-5 h-5 text-violet-500 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-violet-600 block mb-1">EXPLANATION</span>
              <p className="text-sm text-slate-600 leading-relaxed">{result.explanation}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}