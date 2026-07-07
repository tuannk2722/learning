export type User = {
  id: string;
  name: string;
  email: string;
  location: string | null;
  bio: string | null;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  last_study_date: Date | null;
  is_onboarded: boolean;
  avatar_url: string | null;
  created_at: Date;
  status: string;
};

export type UserInfoLogin = {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  is_onboarded: boolean;
  status?: string;
};