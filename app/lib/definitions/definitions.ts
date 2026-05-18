
export type LeaderboardEntry = {
  rank: number;
  name: string;
  level: number;
  xp: number;
  streak: number;
  isCurrentUser?: boolean; // Thuộc tính optional để đánh dấu người dùng hiện tại
  avatar: string;
}

export type Achievement = {
  id: number,
  icon: string,
  title: string,
  description: string,
  unlocked: boolean,
  unlockedDate: string | null,
  rarity: string,
  theme_color: string,
  reward_xp: number
}

export type AchievementPreview = {
  id: number,
  icon: string,
  title: string,
  description: string,
  theme_color: string,
}

export type UnlockedAchievement = {
  id: number;
  title: string;
  description: string | null;
  icon_name: string | null;
  theme_color: string | null;
  reward_xp: number | null;
};

export type AnalyticsStats = {
  label: string;
  value: number | string;
  icon: string;
  color: string;
};

export type StreakResult = {
  streakUpdated: boolean;
  currentStreak: number;
  longestStreak: number;
  isNewRecord: boolean;
}

export type ActivityType = 'lesson' | 'quiz' | 'achievement';

export type HistoryEvent = {
  id: string;
  type: ActivityType;
  title: string;
  course: string | null;
  xp: number;
  completedAt: Date;
};

export type Course = {
  id: number;
  title: string;
  category: string;
  lessons: number;
  level: string;
  students: number;
  status: string;
  bgGradient: string;
}