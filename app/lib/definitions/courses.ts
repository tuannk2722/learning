export interface Category {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  category_id: number;
  name: string;
  description: string;
  level: string;
  icon_name: string;
  theme_color: string;
  total_duration: number;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
  status: string;
}

// Type cho danh sách khóa học (Course Card)
export interface CourseListing extends Course {
  total_lessons: number;
  category_name: string;
  enrolled_count: number;
  progress_percent?: number;
  current_lesson?: string;
}

// Type đầy đủ cho trang chi tiết (Course Detail)
export interface CourseDetail extends CourseListing {
  total_xp: number;
  total_duration: number;
  is_enrolled: boolean;
  completed_lessons: number;
  xp_earned: number;
  learned_minutes: number;
}