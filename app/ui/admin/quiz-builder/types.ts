// Shared types for the Quiz Builder feature

import { CheckCircle, ToggleLeft, Type, LucideIcon } from 'lucide-react';

export type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  xp: number;
}

export interface QuizData {
  title: string;
  description: string;
  totalXp: number;
  passingScore: number;
}

export const QUESTION_TYPES = [
  {
    type: 'multiple_choice' as QuestionType,
    label: 'Multiple Choice',
    description: '4 options, 1 correct answer',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    icon: CheckCircle
  },
  {
    type: 'true_false' as QuestionType,
    label: 'True / False',
    description: 'Simple true or false question',
    color: 'text-green-600',
    bg: 'bg-green-100',
    icon: ToggleLeft
  },
  {
    type: 'fill_blank' as QuestionType,
    label: 'Fill in the Blank',
    description: 'Type the correct answer',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    icon: Type
  },
] as const;

export const DEFAULT_QUIZ_DATA: QuizData = {
  title: '',
  description: '',
  totalXp: 100,
  passingScore: 70,
};
