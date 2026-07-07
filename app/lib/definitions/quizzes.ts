import { ListTodo, ToggleLeft, Type, Code } from 'lucide-react';

export type QuestionType = "multiple-choice" | "true-false" | "fill-blank" | "code";

export const QUESTION_TYPES = [
  {
    type: 'multiple-choice' as const,
    label: 'Multiple Choice',
    description: '4 options, 1 correct answer',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    icon: ListTodo,
  },
  {
    type: 'true-false' as const,
    label: 'True / False',
    description: 'Simple true or false question',
    color: 'text-green-600',
    bg: 'bg-green-100',
    icon: ToggleLeft,
  },
  {
    type: 'fill-blank' as const,
    label: 'Fill in the Blank',
    description: 'Type the correct answer',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    icon: Type,
  },
  {
    type: 'code' as const,
    label: 'Code Question',
    description: 'Write or evaluate code',
    color: 'text-amber-600',
    bg: 'bg-amber-100',
    icon: Code,
  },
];

// Interface cho toàn bộ object Quiz
export interface QuizData {
  title: string;
  totalQuestions: number;
  passingScore: number;
  xpReward?: number;
  questions: Question[];
}

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  code?: string;
  xpReward?: number;
  correctAnswer?: string | number;
  explanation?: string;
  order_index?: number;
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

export interface QuizResultContainer {
  courseId: string;
  lessonId: string;
  nextLessonId: number | null;
  score: number;
  total: number;
  xpEarned: number;
  passed: boolean;
  passingScore: number;
  results: QuestionResult[];
}