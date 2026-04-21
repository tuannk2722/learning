import bcrypt from 'bcrypt';
import { db } from '@/app/lib/db';
import * as schema from '@/app/lib/db/schema';
import { sql } from 'drizzle-orm';

async function seedDatabase() {
  // 1. CLEAR EXISTING DATA (In reverse order of relations)
  console.log('Clearing existing data...');
  await db.delete(schema.user_achievements);
  await db.delete(schema.user_lesson_progress);
  await db.delete(schema.enrollments);
  await db.delete(schema.questions);
  await db.delete(schema.quizzes);
  await db.delete(schema.lessons);
  await db.delete(schema.sections);
  await db.delete(schema.courses);
  await db.delete(schema.categories);
  await db.delete(schema.achievements);
  await db.delete(schema.users);

  const hashedPassword = await bcrypt.hash('123456', 10);

  // 2. SEED USERS
  console.log('Seeding users...');
  await db.insert(schema.users).values([
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442a',
      name: 'Admin User',
      email: 'admin@learnquest.com',
      password_hash: hashedPassword,
      is_onboarded: true,
      total_xp: 500,
    },
    {
      id: '5c4b1827-0cc6-4eb1-b956-628d022b3e41',
      name: 'Student A',
      email: 'studenta@learnquest.com',
      password_hash: hashedPassword,
      is_onboarded: false,
      total_xp: 150,
    },
    {
      id: '8a892b1d-0cc6-4eb1-b956-628d022b3e42',
      name: 'Student B',
      email: 'studentb@learnquest.com',
      password_hash: hashedPassword,
      is_onboarded: true,
      total_xp: 800,
    },
  ]);

  // 3. SEED CATEGORIES
  console.log('Seeding categories...');
  await db.insert(schema.categories).values([
    { id: 1, name: 'Mathematics', slug: 'mathematics' },
    { id: 2, name: 'Physics', slug: 'physics' },
    { id: 3, name: 'Computer Science', slug: 'computer-science' },
    { id: 4, name: 'History', slug: 'history' },
  ]);

  // 4. SEED COURSES
  console.log('Seeding courses...');
  await db.insert(schema.courses).values([
    {
      id: 1,
      category_id: 1,
      name: 'Advanced Calculus',
      description: 'Master derivatives, integrals, and differential equations',
      level: 'Advanced',
      icon_name: 'calculator',
      theme_color: 'blue',
      estimated_hours: 8,
      rating: '4.8',
      reviews_count: 120,
    },
    {
      id: 2,
      category_id: 2,
      name: 'Quantum Physics',
      description: 'Explore quantum mechanics and particle behavior',
      level: 'Advanced',
      icon_name: 'atom',
      theme_color: 'purple',
      estimated_hours: 6,
      rating: '4.9',
      reviews_count: 85,
    },
    {
      id: 3,
      category_id: 3,
      name: 'Intro to React',
      description: 'Learn modern web development',
      level: 'Beginner',
      icon_name: 'code',
      theme_color: 'cyan',
      estimated_hours: 10,
      rating: '4.7',
      reviews_count: 210,
    },
  ]);

  // 5. SEED SECTIONS
  console.log('Seeding sections...');
  await db.insert(schema.sections).values([
    { id: 1, course_id: 1, title: 'Derivatives Basics', order_index: 1 },
    { id: 2, course_id: 1, title: 'Integration Mastery', order_index: 2 },
    { id: 3, course_id: 3, title: 'Component Architecture', order_index: 1 },
  ]);

  // 6. SEED LESSONS
  console.log('Seeding lessons...');
  await db.insert(schema.lessons).values([
    {
      id: 1,
      section_id: 1,
      title: 'What is a Derivative?',
      duration_minutes: 15,
      xp_reward: 50,
      lesson_type: 'video',
      content_html: 'Introduction to derivatives concepts.',
      video_url: 'https://youtube.com/watch?v=1',
      order_index: 1,
    },
    {
      id: 2,
      section_id: 1,
      title: 'Power Rule',
      duration_minutes: 10,
      xp_reward: 30,
      lesson_type: 'video',
      content_html: 'Learn the power rule shortcut.',
      video_url: 'https://youtube.com/watch?v=2',
      order_index: 2,
    },
    {
      id: 3,
      section_id: 3,
      title: 'Understanding JSX',
      duration_minutes: 20,
      xp_reward: 100,
      lesson_type: 'doc',
      content_html: '<h1>JSX Basics</h1><p>JSX is syntax extension...</p>',
      order_index: 1,
    },
  ]);

  // 7. SEED QUIZZES
  console.log('Seeding quizzes...');
  await db.insert(schema.quizzes).values([
    { id: 1, lesson_id: 1, title: 'Derivative Fundamentals Quiz', passing_score: 80, xp_reward: 150 },
    { id: 2, lesson_id: 3, title: 'React JSX Knowledge Check', passing_score: 100, xp_reward: 200 },
  ]);

  // 8. SEED QUESTIONS
  console.log('Seeding questions...');
  await db.insert(schema.questions).values([
    {
      id: 1,
      quiz_id: 1,
      question_type: 'multiple-choice',
      question_text: 'What is the derivative of x^2?',
      explanation: 'Power rule: bring down the 2 and subtract 1 from exponent.',
      metadata: { options: ['x', '2x', 'x^3', '2'] },
      correct_answer: '1',
      order_index: 1,
    },
    {
      id: 2,
      quiz_id: 1,
      question_type: 'true-false',
      question_text: 'The derivative of a constant is always 0.',
      explanation: 'Constants do not change, so their rate of change is 0.',
      correct_answer: 'true',
      order_index: 2,
    },
    {
      id: 3,
      quiz_id: 2,
      question_type: 'multiple-choice',
      question_text: 'Which HTML attribute becomes className in JSX?',
      explanation: 'class becomes className to avoid conflicts with JS keyword.',
      metadata: { options: ['class', 'id', 'href'] },
      correct_answer: '0',
      order_index: 1,
    },
  ]);

  // 9. SEED ACHIEVEMENTS
  console.log('Seeding achievements...');
  await db.insert(schema.achievements).values([
    {
      id: 1,
      title: 'First Blood',
      description: 'Complete your very first lesson.',
      icon_name: 'zap',
      rarity: 'COMMON',
      theme_color: 'bg-yellow-100',
      unlock_condition: { type: 'lesson_count', value: 1 },
    },
    {
      id: 2,
      title: 'Math Wizard',
      description: 'Complete 5 Math lessons.',
      icon_name: 'calculator',
      rarity: 'RARE',
      theme_color: 'bg-blue-100',
      unlock_condition: { type: 'category_lesson_count', category: 'Mathematics', value: 5 },
    },
    {
      id: 3,
      title: 'React Master',
      description: 'Pass the React Quiz perfectly.',
      icon_name: 'award',
      rarity: 'EPIC',
      theme_color: 'bg-purple-100',
      unlock_condition: { type: 'quiz_score', quiz_id: 2, value: 100 },
    },
  ]);

  // 10. SEED RELATIONS (Enrollments & Progress)
  console.log('Seeding relations...');
  await db.insert(schema.enrollments).values([
    { user_id: '410544b2-4001-4271-9855-fec4b6a6442a', course_id: 1, progress_percent: 50, status: 'ACTIVE' },
    { user_id: '410544b2-4001-4271-9855-fec4b6a6442a', course_id: 3, progress_percent: 10, status: 'ACTIVE' },
    { user_id: '5c4b1827-0cc6-4eb1-b956-628d022b3e41', course_id: 1, progress_percent: 100, status: 'COMPLETED' },
  ]);

  await db.insert(schema.user_lesson_progress).values([
    { user_id: '410544b2-4001-4271-9855-fec4b6a6442a', lesson_id: 1, status: 'COMPLETED' },
    { user_id: '410544b2-4001-4271-9855-fec4b6a6442a', lesson_id: 2, status: 'UNLOCKED' },
    { user_id: '5c4b1827-0cc6-4eb1-b956-628d022b3e41', lesson_id: 1, status: 'COMPLETED' },
  ]);

  await db.insert(schema.user_achievements).values([
    { user_id: '410544b2-4001-4271-9855-fec4b6a6442a', achievement_id: 1 },
    { user_id: '5c4b1827-0cc6-4eb1-b956-628d022b3e41', achievement_id: 1 },
  ]);

  console.log('Seed completed successfully!');
}

export async function GET() {
  try {
    await seedDatabase();
    return Response.json({ message: 'Khởi tạo Cơ sở dữ liệu LearnQuest (Drizzle) thành công!' });
  } catch (error) {
    console.error('Lỗi khi Seed database:', error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

