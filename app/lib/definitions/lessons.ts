// 1. Types đại diện cho Database Schema
export interface Section {
  id: number;
  course_id: number;
  title: string;
  order_index: number;
}

export interface Lesson {
  id: number;
  section_id: number;
  title: string;
  duration_minutes: number;
  xp_reward: number;
  lesson_type: string;
  content?: string;
  video_url?: string;
  order_index: number;
}

// 2. Types đại diện cho UI/Frontend (Curriculum)
export interface CurriculumLesson {
  id: number;
  title: string;
  duration: number;
  xp: number;
  completed: boolean;
  locked: boolean;
  isCurrent?: boolean;
}

export interface CurriculumSection {
  section: string; // Tên chương
  lessons: CurriculumLesson[];
}

export type CourseCurriculum = CurriculumSection[];

export type ListLesson = CurriculumLesson[];

export interface DetailLesson {
  content: string | null;
  courseTitle: string;
  course_id: number;
  duration_minutes: number;
  id: number;
  isCompleted: boolean;
  lessonNumber: number;
  lesson_type: string;
  title: string;
  totalLessons: number;
  video_url: string | null;
  xp_reward: number;
}