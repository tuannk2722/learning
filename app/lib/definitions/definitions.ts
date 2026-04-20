// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  joinDate: string;
  location: string;
  bio: string;
};

export type UserInfo = {
  name: string;
  email: string;
  joinDate: string;
  location: string;
  bio: string;
}

export interface Course {
  id: number;
  name: string;
  icon: string;
  description: string;
  lessons: number;
  duration: string;
  level: string;
  xp: number;
  category: string;
  enrolled: boolean;
  progress: number;
  rating: number;
  students: number;
  color: string;
  bgColor: string;
  iconColor: string;
}

export interface Lesson {
  id: number;
  title: string;
  duration: number; // Thời lượng (thường tính bằng phút)
  xp: number;       // Điểm kinh nghiệm
  completed: boolean;
  locked: boolean;
  isCurrent?: boolean; // Thuộc tính optional (có thể có hoặc không)
}

export interface CurriculumSection {
  section: string;
  lessons: Lesson[];
}

// Nếu bạn muốn định nghĩa kiểu cho cả mảng curriculum
export type Curriculum = CurriculumSection[];

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
  color: string,
  bgColor: string
}

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
