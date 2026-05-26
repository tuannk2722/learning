import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
  uuid,
  serial,
  jsonb,
  numeric,
  primaryKey
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// 1. BẢNG USERS
export const users = pgTable('users', {
  id: uuid('id').default(sql`uuid_generate_v4()`).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash'),
  bio: text('bio'),
  location: varchar('location', { length: 255 }),
  avatar_url: text('avatar_url'),
  total_xp: integer('total_xp').default(0),
  current_streak: integer('current_streak').default(0),
  longest_streak: integer('longest_streak').default(0),
  last_study_date: timestamp('last_study_date'),
  is_onboarded: boolean('is_onboarded').default(false),
  created_at: timestamp('created_at').defaultNow(),
});

// 15. BẢNG PASSWORD_RESET_TOKENS
export const password_reset_tokens = pgTable('password_reset_tokens', {
  id: serial('id').primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

// 2. BẢNG CATEGORIES
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
});

// 3. BẢNG COURSES
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  category_id: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  description: text('description'),
  level: varchar('level', { length: 50 }),
  icon_name: varchar('icon_name', { length: 50 }),
  theme_color: varchar('theme_color', { length: 50 }),
  rating: numeric('rating', { precision: 2, scale: 1 }).default('0.0'),
  reviews_count: integer('reviews_count').default(0),
  status: varchar('status', { length: 50 }).default('draft'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// 4. BẢNG SECTIONS
export const sections = pgTable('sections', {
  id: serial('id').primaryKey(),
  course_id: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  order_index: integer('order_index').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// 5. BẢNG LESSONS
export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  section_id: integer('section_id').references(() => sections.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  duration_minutes: integer('duration_minutes'),
  xp_reward: integer('xp_reward').default(0),
  blocks: jsonb('blocks'),
  order_index: integer('order_index').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// 6. BẢNG ENROLLMENTS
export const enrollments = pgTable('enrollments', {
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  course_id: integer('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  progress_percent: integer('progress_percent').default(0),
  status: varchar('status', { length: 50 }).default('ACTIVE'),
  enrolled_at: timestamp('enrolled_at').defaultNow(),
  last_accessed_at: timestamp('last_accessed_at'),
  user_rating: integer('user_rating'),
}, (t) => ({
  pk: primaryKey({ columns: [t.user_id, t.course_id] }),
}));

// 7. BẢNG USER_LESSON_PROGRESS
export const user_lesson_progress = pgTable('user_lesson_progress', {
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  lesson_id: integer('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).default('locked'),
  completed_at: timestamp('completed_at'),
}, (t) => ({
  pk: primaryKey({ columns: [t.user_id, t.lesson_id] }),
}));

// 8. BẢNG QUIZZES
export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  lesson_id: integer('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  passing_score: integer('passing_score').default(50),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// 9. BẢNG QUESTIONS
export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  quiz_id: integer('quiz_id').references(() => quizzes.id, { onDelete: 'cascade' }),
  question_type: varchar('question_type', { length: 50 }).notNull(),
  question_text: text('question_text').notNull(),
  explanation: text('explanation'),
  xp_reward: integer('xp_reward').default(0),
  metadata: jsonb('metadata'),
  correct_answer: text('correct_answer').notNull(),
  order_index: integer('order_index').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// 10. BẢNG QUIZ_ATTEMPTS (Lịch sử làm quiz)
export const quiz_attempts = pgTable('quiz_attempts', {
  id: serial('id').primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  quiz_id: integer('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(),
  total: integer('total').notNull(),
  passed: boolean('passed').notNull(),
  xp_earned: integer('xp_earned').default(0),
  answers: jsonb('answers'),
  completed_at: timestamp('completed_at').defaultNow(),
});

// 10. BẢNG ACHIEVEMENTS
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  icon_name: varchar('icon_name', { length: 50 }),
  rarity: varchar('rarity', { length: 50 }).default('COMMON'),
  theme_color: varchar('theme_color', { length: 50 }),
  unlock_condition: jsonb('unlock_condition'),
  reward_xp: integer('reward_xp').default(0),
});

// 11. BẢNG USER_ACHIEVEMENTS
export const user_achievements = pgTable('user_achievements', {
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievement_id: integer('achievement_id').notNull().references(() => achievements.id, { onDelete: 'cascade' }),
  unlocked_at: timestamp('unlocked_at').defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.user_id, t.achievement_id] }),
}));

// 12. BẢNG LESSON_NOTES (1 note per user per lesson)
export const lesson_notes = pgTable('lesson_notes', {
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  lesson_id: integer('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.user_id, t.lesson_id] }),
}));

// 13. BẢNG DAILY_QUEST_DEFINITIONS (Template các quest)
export const daily_quest_definitions = pgTable('daily_quest_definitions', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  icon_name: varchar('icon_name', { length: 50 }),
  quest_type: varchar('quest_type', { length: 50 }).notNull(), // COMPLETE_LESSONS | EARN_XP | PASS_QUIZ | STUDY_TIME
  target_value: integer('target_value').notNull(),
  reward_xp: integer('reward_xp').notNull().default(50),
});

// 14. BẢNG USER_DAILY_QUESTS (Tiến độ quest của user theo ngày)
export const user_daily_quests = pgTable('user_daily_quests', {
  id: serial('id').primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  quest_id: integer('quest_id').notNull().references(() => daily_quest_definitions.id, { onDelete: 'cascade' }),
  quest_date: text('quest_date').notNull(), // 'YYYY-MM-DD'
  current_progress: integer('current_progress').default(0),
  is_completed: boolean('is_completed').default(false),
  completed_at: timestamp('completed_at'),
  reward_claimed: boolean('reward_claimed').default(false),
});

