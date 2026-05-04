
export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  level: number;
  xp: number;
  streak: number;
  trend: string;
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

export type AnalyticsStats = {
  label: string;
  value: number | string;
  icon: string;
  color: string;
};

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

// Tổng hợp lại thành một Union Type
// export type Question = MultipleChoiceQuestion | TrueFalseQuestion | FillBlankQuestion;

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
  correctAnswer: string | number;
  code?: string;
  explanation?: string;
}

export interface QuizData {
  title: string;
  totalQuestions: number;
  passingScore: number;
  xpReward: number;
  questions: Question[];
}

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
