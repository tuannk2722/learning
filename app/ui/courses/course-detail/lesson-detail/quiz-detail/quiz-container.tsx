"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import QuestionCard from "./quiz-question-card";
import QuizHeader from "./quiz-header";
import QuizFooter from "./quiz-footer";
import { QuizData } from "@/app/lib/definitions/quizzes";
import { QuizSubmitResult } from "@/app/lib/definitions/quiz-results";
import { showQuestToasts } from "@/app/ui/quests/quest-toast";

export default function QuizContainer({
  quiz,
  courseId,
  lessonId,
  onSubmit,
}: {
  quiz: QuizData;
  courseId: string;
  lessonId: string;
  onSubmit: (answers: { [key: number]: string | number }) => Promise<QuizSubmitResult>;
}) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: any }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (answer: any) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = await onSubmit(selectedAnswers);

      if (result.success && result.attemptId) {
        if (result.questUpdates && result.questUpdates.length > 0) {
          showQuestToasts(result.questUpdates);
        }

        router.push(
          `/dashboard/courses/${courseId}/lesson/${lessonId}/quiz/result/${result.attemptId}`
        );
      } else {
        setIsSubmitting(false);
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <QuizHeader
        xpReward={quiz.xpReward}
        currentQuestion={currentQuestion}
        totalQuestions={quiz.questions.length}
      />

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

      <QuizFooter
        currentQuestion={currentQuestion}
        totalQuestions={quiz.questions.length}
        selectedAnswers={selectedAnswers}
        isSubmitting={isSubmitting}
        onPrevious={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
        onNext={() => setCurrentQuestion(prev => prev + 1)}
        onNavigate={setCurrentQuestion}
        onSubmit={handleSubmit}
      />
    </div>
  );
}