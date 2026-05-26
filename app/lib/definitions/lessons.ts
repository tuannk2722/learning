// 1. Types đại diện cho Database Schema
export interface Section {
  id: number;
  course_id: number;
  title: string;
  order_index: number;
}

export type BlockType = 'text' | 'video' | 'image' | 'code';

export interface LessonBlock {
  id: string;
  type: BlockType;
  content: string;
  metadata?: Record<string, any>;
}

export function parseLessonBlocks(raw: unknown): LessonBlock[] {
  if (!raw) return [];
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as LessonBlock[];
    } catch {
      return [];
    }
  }
  if (Array.isArray(raw)) {
    return raw as LessonBlock[];
  }
  return [];
}

export interface Lesson {
  id: number;
  section_id: number;
  title: string;
  duration_minutes: number;
  xp_reward: number;
  blocks?: LessonBlock[] | null;
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
  courseTitle: string;
  course_id: number;
  duration_minutes: number;
  id: number;
  isCompleted: boolean;
  lessonNumber: number;
  title: string;
  totalLessons: number;
  xp_reward: number;
  blocks: LessonBlock[] | null;
}


// ADMIN
export type CourseBuilderLesson = {
  id: number;
  title: string;
  // type: string;
  duration: number;
  xp: number;
};

export type CourseBuilderSection = {
  id: number;
  title: string;
  lessons: CourseBuilderLesson[];
};

export type CourseBuilderResult = {
  id: number;
  name: string;
  description: string | null;
  category_id: number | null;
  category_name?: string | null;
  level: string | null;
  icon: string | null;
  theme_color: string | null;
  status?: string | null;
  sections: CourseBuilderSection[];
};

// Lesson Builder
export interface LessonBuilderData {
  title: string;
  xp: number;
  estimate_time: number;
}

export interface BlockTypeInfo {
  type: BlockType;
  label: string;
  color: string;
  bg: string;
  // icon is intentionally omitted here – each consumer imports the Lucide icon itself
}

export const BLOCK_TYPE_META: Record<BlockType, Omit<BlockTypeInfo, 'type'>> = {
  text:  { label: 'Text',  color: 'text-blue-600',   bg: 'bg-blue-50'   },
  video: { label: 'Video', color: 'text-red-600',    bg: 'bg-red-50'    },
  image: { label: 'Image', color: 'text-green-600',  bg: 'bg-green-50'  },
  code:  { label: 'Code',  color: 'text-purple-600', bg: 'bg-purple-50' },
};