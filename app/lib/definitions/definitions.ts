
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

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type RecentActivity = {
  id: string;
  name: string;
  time: string;
  exp: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<RecentActivity, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
