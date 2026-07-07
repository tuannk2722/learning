export type QuestionType = "multiple-choice" | "true-false" | "fill-blank" | "code";

// // Interface cho toàn bộ object Quiz
export interface QuizData {
  title: string;
  totalQuestions: number;
  passingScore: number;
  xpReward: number;
  questions: Question[];
}

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  code?: string;
}