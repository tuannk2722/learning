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
  primaryKey,
  index
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
  status: varchar('status', { length: 50 }).default('active'),
});

// 15. BẢNG PASSWORD_RESET_TOKENS
export const password_reset_tokens = pgTable('password_reset_tokens', {
  id: serial('id').primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

// 2. BẢNG COURSES
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  categories: text('categories').array().default(sql`'{}'::text[]`),
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
  status: varchar('status', { length: 50 }).default('draft'),
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

// 16. BẢNG ACTIVITY_LOGS (Nhật ký hoạt động cho admin)
export const activity_logs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 100 }).notNull(),
  entity_type: varchar('entity_type', { length: 50 }),
  entity_id: text('entity_id'),
  entity_name: text('entity_name'),
  metadata: jsonb('metadata'),
  created_at: timestamp('created_at').defaultNow(),
});

// ─── FLASHCARDS ────────────────────────────────────────────────────────────────

// 17. BẢNG FLASHCARD_SETS
export const flashcard_sets = pgTable('flashcard_sets', {
  id: uuid('id').default(sql`uuid_generate_v4()`).primaryKey(),
  owner_id: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  is_public: boolean('is_public').default(true).notNull(),
  tags: text('tags').array().default(sql`'{}'::text[]`),
  front_lang: varchar('front_lang', { length: 10 }).default('en-US'),
  back_lang: varchar('back_lang', { length: 10 }).default('en-US'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (t) => ({
  owner_idx: index('flashcard_sets_owner_idx').on(t.owner_id),
}));

// 18. BẢNG FLASHCARD_ITEMS
export const flashcard_items = pgTable('flashcard_items', {
  id: uuid('id').default(sql`uuid_generate_v4()`).primaryKey(),
  set_id: uuid('set_id').notNull().references(() => flashcard_sets.id, { onDelete: 'cascade' }),
  front: text('front').notNull(),
  back: text('back').notNull(),
  image_url: text('image_url'),
  order_index: integer('order_index').notNull().default(0),
  created_at: timestamp('created_at').defaultNow(),
}, (t) => ({
  set_idx: index('flashcard_items_set_idx').on(t.set_id),
}));

// 19. BẢNG FLASHCARD_ACCESS_LOG (dùng cho "Recent")
export const flashcard_access_log = pgTable('flashcard_access_log', {
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  set_id: uuid('set_id').notNull().references(() => flashcard_sets.id, { onDelete: 'cascade' }),
  accessed_at: timestamp('accessed_at').defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.user_id, t.set_id] }),
}));

// 20. BẢNG FLASHCARD_CARD_PROGRESS (status mỗi card per user)
// Chỉ lưu khi user đã bấm correct / incorrect (không lưu null)
// PK(user_id, card_id) — mỗi user chỉ có 1 status per card (của session gần nhất)
export const flashcard_card_progress = pgTable('flashcard_card_progress', {
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  set_id: uuid('set_id').notNull().references(() => flashcard_sets.id, { onDelete: 'cascade' }),
  card_id: uuid('card_id').notNull().references(() => flashcard_items.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 20 }), // 'correct' | 'incorrect' or null
  updated_at: timestamp('updated_at').defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.user_id, t.card_id] }),
  set_user_idx: index('flashcard_card_progress_set_user_idx').on(t.set_id, t.user_id),
}));

// 21. BẢNG FLASHCARD_STUDY_SESSIONS (Lưu trạng thái phiên học flashcard per user/set)
// track_progress: user có bật track progress không
// last_card_index: vị trí card cuối cùng (chỉ có ý nghĩa khi track_progress = false)
export const flashcard_study_sessions = pgTable('flashcard_study_sessions', {
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  set_id: uuid('set_id').notNull().references(() => flashcard_sets.id, { onDelete: 'cascade' }),
  track_progress: boolean('track_progress').notNull().default(false),
  last_card_index: integer('last_card_index').notNull().default(0),
  updated_at: timestamp('updated_at').defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.user_id, t.set_id] }),
}));

// 22. BẢNG LESSON_SESSIONS (Theo dõi phiên học bài theo thời gian thực)
// Mỗi lần user mở 1 lesson → tạo 1 session mới với session_token duy nhất.
// Heartbeat API sẽ cộng dần accumulated_seconds.
// Khi user mở tab mới → session cũ bị deactivate (is_active = false).
export const lesson_sessions = pgTable('lesson_sessions', {
  id: serial('id').primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  lesson_id: integer('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  session_token: varchar('session_token', { length: 64 }).notNull().unique(),
  accumulated_seconds: integer('accumulated_seconds').default(0),
  last_heartbeat_at: timestamp('last_heartbeat_at').defaultNow(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow(),
}, (t) => ({
  user_lesson_idx: index('lesson_sessions_user_lesson_idx').on(t.user_id, t.lesson_id),
  token_idx: index('lesson_sessions_token_idx').on(t.session_token),
}));
