"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Zap, Flag, ChevronRight, ChevronLeft } from "lucide-react";
import { QuizData } from "@/app/lib/definitions/definitions";
import QuestionCard from "./quiz-question-card";

export default function QuizContainer({ quiz, courseId, lessonId }: { quiz: QuizData, courseId: string, lessonId: string }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: any }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleSelect = (answer: any) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
  };

  const handleSubmit = () => {
    console.log("Submitting...", selectedAnswers);
    setShowResults(true);
    // Navigate to results page
    const correct = quiz.questions.filter((q, i) =>
      selectedAnswers[i] === q.correctAnswer ||
      (typeof selectedAnswers[i] === "string" && selectedAnswers[i].toLowerCase().includes(String(q.correctAnswer).toLowerCase()))
    ).length;

    setTimeout(() => {
      window.location.href = `/dashboard/courses/${courseId}/lesson/${lessonId}/quiz/result?score=${correct}&total=${quiz.questions.length}`;
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto">

      <div className="bg-white rounded-2xl shadow-sm border border-violet-100 p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-100">
            <Zap className="w-4 h-4" />
            <span className="font-bold">+{quiz.xpReward} XP</span>
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
          <span className="text-sm font-bold text-violet-700">{currentQuestion + 1}/{quiz.questions.length}</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">{quiz.title}</h1>

      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentQuestion}
          question={quiz.questions[currentQuestion]}
          index={currentQuestion}
          selectedAnswer={selectedAnswers[currentQuestion]}
          onSelect={handleSelect}
        />
      </AnimatePresence>

      {/* Footer Controls */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" /> Previous
        </button>

        <div className="hidden md:flex gap-2">
          {quiz.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestion(i)}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${i === currentQuestion ? "bg-violet-600 text-white shadow-lg shadow-violet-200" :
                selectedAnswers[i] !== undefined ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:opacity-90 shadow-lg shadow-violet-200"
          >
            <Flag className="w-5 h-5" /> Submit
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700"
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}