'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, AlertCircle, HelpCircle, Check, BookOpen } from 'lucide-react';
import { Question } from '@/app/lib/definitions/quizzes';

interface QuizPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  passingScore: number;
  questions: Question[];
}

export default function QuizPreviewModal({
  isOpen,
  onClose,
  title,
  passingScore,
  questions,
}: QuizPreviewModalProps) {
  // Prevent page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const totalXp = questions.reduce((sum, q) => sum + (q.xpReward || 0), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            className="relative w-full h-full md:h-[85vh] md:max-w-4xl bg-slate-50 md:rounded-3xl shadow-2xl border border-slate-100 z-10 flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 text-xs font-bold text-violet-600 bg-violet-50 rounded-full border border-violet-100 uppercase tracking-wide">
                  Student View Preview
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-50 text-gray-400 hover:text-gray-600 transition-colors border border-transparent hover:border-slate-100 cursor-pointer"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/50">
              <div className="max-w-3xl mx-auto space-y-6">

                {/* Quiz Title & Header Stats */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-amber-600 font-extrabold text-xs bg-amber-50 border border-amber-100/50 px-2.5 py-0.5 rounded-full">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{totalXp} Total XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 font-extrabold text-xs bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 rounded-full">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{questions.length} Questions</span>
                    </div>
                    <div className="flex items-center gap-1 text-indigo-600 font-extrabold text-xs bg-indigo-50 border border-indigo-100/50 px-2.5 py-0.5 rounded-full">
                      <span>{passingScore}% to Pass</span>
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                    {title || 'Untitled Quiz'}
                  </h1>
                </div>

                {/* Questions List Container */}
                <div className="space-y-6">
                  {questions.map((question, index) => {
                    return (
                      <div
                        key={question.id}
                        className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-150 space-y-6"
                      >
                        {/* Question Meta Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-800">
                              Question {index + 1}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-violet-500 px-2.5 py-0.5 bg-violet-50 rounded-full">
                              {question.type}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-yellow-600">
                            +{question.xpReward || 0} XP
                          </span>
                        </div>

                        {/* Question Text */}
                        <div className="space-y-3">
                          <h3 className="text-lg font-bold text-slate-800 leading-snug">
                            {question.question || 'Untitled Question'}
                          </h3>
                          {question.code && (
                            <pre className="bg-slate-900 text-slate-100 p-5 rounded-2xl overflow-x-auto font-mono text-sm leading-relaxed shadow-inner">
                              <code>{question.code}</code>
                            </pre>
                          )}
                        </div>

                        {/* Answer Options & Correct Highlight */}
                        <div className="space-y-3 pt-2">
                          {/* Multiple Choice & Code Options */}
                          {(question.type === 'multiple-choice' || question.type === 'code') && question.options?.map((opt, optIdx) => {
                            const isCorrect = Number(question.correctAnswer) === optIdx;
                            return (
                              <div
                                key={optIdx}
                                className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${isCorrect
                                  ? 'border-green-500 bg-green-50/50 text-green-950 font-semibold shadow-sm'
                                  : 'border-slate-100 bg-slate-50/30 text-slate-600'
                                  }`}
                              >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isCorrect ? 'border-green-600 bg-green-600 text-white' : 'border-slate-300 bg-white'
                                  }`}>
                                  {isCorrect && <Check className="w-3.5 h-3.5" />}
                                </div>
                                <span>{opt || `Option ${String.fromCharCode(65 + optIdx)}`}</span>
                              </div>
                            );
                          })}

                          {/* True / False Options */}
                          {question.type === 'true-false' && (
                            <div className="grid grid-cols-2 gap-4">
                              {['True', 'False'].map((opt) => {
                                const isCorrect = String(question.correctAnswer).toLowerCase() === opt.toLowerCase();
                                return (
                                  <div
                                    key={opt}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 font-bold transition-all text-sm ${isCorrect
                                      ? 'border-green-500 bg-green-50/50 text-green-950 shadow-sm'
                                      : 'border-slate-100 bg-slate-50/30 text-slate-400'
                                      }`}
                                  >
                                    <span>{opt}</span>
                                    {isCorrect && <Check className="w-5 h-5 text-green-600" />}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Fill in the Blank Option */}
                          {question.type === 'fill-blank' && (
                            <div className="p-4 rounded-xl border border-green-500 bg-green-50/50 text-green-950 flex items-center gap-3">
                              <span className="text-xs font-extrabold uppercase tracking-wider text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full border border-green-200">
                                Correct Answer
                              </span>
                              <span className="font-semibold text-lg">{question.correctAnswer || 'Not set'}</span>
                            </div>
                          )}
                        </div>

                        {/* Explanation Section (Always Visible) */}
                        <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex gap-3 text-sm">
                          <BookOpen className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                          <div className="space-y-1.5 flex-1">
                            <div className="font-extrabold text-slate-700 uppercase tracking-widest text-[10px]">
                              Explanation & Learning Content
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                              {question.explanation || 'No explanation provided for this question.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {questions.length === 0 && (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-150">
                      <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-400 italic text-sm">
                        No questions added to this quiz yet. Start editing to preview.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
