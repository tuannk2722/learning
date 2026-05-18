export type QuestionType = "multiple-choice" | "true-false" | "fill-blank" | "code";

// Interface cho toàn bộ object Quiz
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
  xpReward?: number;
}

/** Kết quả chi tiết cho từng câu hỏi sau khi chấm */
import { QuestUpdateInfo } from "./quests";
import type { StreakResult, UnlockedAchievement } from "../definitions/definitions";

export interface QuestionResult {
  id: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  xpReward?: number;
}

/** Kết quả tổng thể của một lần làm quiz (trả về từ server action) */
export interface QuizSubmitResult {
  success: boolean;
  attemptId?: number;
  score: number;
  total: number;
  passed: boolean;
  xpEarned: number;
  passingScore: number;
  results: QuestionResult[];
  questUpdates?: QuestUpdateInfo[];
  streakResult?: StreakResult;
  unlockedAchievements?: UnlockedAchievement[];
}

/** Tóm tắt 1 lần làm quiz (dùng cho list ở Analytics) */
export interface QuizAttemptSummary {
  id: number;
  quizTitle: string;
  lessonTitle: string;
  courseId: number;
  lessonId: number;
  score: number;
  total: number;
  passed: boolean;
  xpEarned: number;
  completedAt: string;
}

/** Chi tiết 1 lần làm quiz (dùng cho trang result/[attemptId]) */
export interface QuizAttemptDetail {
  id: number;
  quizTitle: string;
  score: number;
  total: number;
  passed: boolean;
  xpEarned: number;
  passingScore: number;
  completedAt: string;
  answers: QuestionResult[];
}
