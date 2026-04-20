"use client";

import { motion } from "motion/react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Question } from "@/app/lib/definitions/definitions";

interface Props {
  question: Question;
  index: number;
  selectedAnswer: any;
  onSelect: (val: any) => void;
}

export default function QuestionCard({ question, index, selectedAnswer, onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-3xl p-8 shadow-sm border border-violet-100"
    >
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-violet-500 px-3 py-1 bg-violet-50 rounded-full">
          {question.type}
        </span>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">{question.question}</h2>

        {question.code && (
          <pre className="mt-4 bg-slate-900 text-slate-100 p-5 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed">
            <code>{question.code}</code>
          </pre>
        )}
      </div>

      <div className="space-y-3">
        {/* Multiple Choice & Code Results */}
        {(question.type === "multiple-choice" || question.type === "code") && question.options?.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedAnswer === i ? "border-violet-500 bg-violet-50 shadow-sm" : "border-gray-100 hover:border-violet-200"
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAnswer === i ? "border-violet-500 bg-violet-500" : "border-gray-300"
                }`}>
                {selectedAnswer === i && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className={selectedAnswer === i ? "font-medium text-violet-900" : "text-gray-700"}>
                {opt}
              </span>
            </div>
          </button>
        ))}

        {/* True/False */}
        {question.type === "true-false" && (
          <div className="grid grid-cols-2 gap-4">
            {["true", "false"].map((opt) => (
              <button
                key={opt}
                onClick={() => onSelect(opt)}
                className={`p-8 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${selectedAnswer === opt ? "border-violet-500 bg-violet-50" : "border-gray-100 hover:border-violet-200"
                  }`}
              >
                {opt === "true" ?
                  <CheckCircle2 className={`w-10 h-10 ${selectedAnswer === opt ? "text-violet-600" : "text-gray-300"}`} /> :
                  <XCircle className={`w-10 h-10 ${selectedAnswer === opt ? "text-violet-600" : "text-gray-300"}`} />
                }
                <span className="font-bold uppercase">{opt}</span>
              </button>
            ))}
          </div>
        )}

        {/* Fill Blank */}
        {question.type === "fill-blank" && (
          <input
            type="text"
            value={selectedAnswer || ""}
            onChange={(e) => onSelect(e.target.value)}
            placeholder="Input answer..."
            className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-violet-500 outline-none text-lg"
          />
        )}
      </div>
    </motion.div>
  );
}