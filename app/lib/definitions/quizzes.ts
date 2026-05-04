// Định nghĩa các loại câu hỏi cho phép
export type QuestionType = "multiple-choice" | "true-false" | "fill-blank" | "code";

// Base interface chứa các thuộc tính chung
interface BaseQuestion {
  id: number;
  type: QuestionType;
  question: string;
  explanation: string;
}

// Các interface cụ thể cho từng loại
interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice" | "code"; // Cả 2 loại này đều dùng options và index số
  options: string[];
  correctAnswer: number;
  code?: string; // Riêng loại code thì có thêm thuộc tính này
}

interface TrueFalseQuestion extends BaseQuestion {
  type: "true-false";
  correctAnswer: "true" | "false";
}

interface FillBlankQuestion extends BaseQuestion {
  type: "fill-blank";
  correctAnswer: string;
}

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