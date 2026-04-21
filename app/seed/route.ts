import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedDatabase(t: any) {
  await t`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await t`DROP TABLE IF EXISTS invoices, customers, revenue CASCADE`;
  await t`DROP TABLE IF EXISTS user_achievements, achievements, questions, quizzes, user_lesson_progress, enrollments, lessons, sections, courses, categories, users CASCADE`;

  // 1. BẢNG USERS 
  await t`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, 
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      bio TEXT,
      location VARCHAR(255),
      avatar_url TEXT,
      total_xp INT DEFAULT 0,
      current_streak INT DEFAULT 0,
      longest_streak INT DEFAULT 0,
      last_study_date TIMESTAMP,
      is_onboarded BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // 2. BẢNG CATEGORIES
  await t`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE
    );
  `;

  // 3. BẢNG COURSES
  await t`
    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      category_id INT REFERENCES categories(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      description TEXT,
      level VARCHAR(50),
      icon_name VARCHAR(50),
      theme_color VARCHAR(50),
      estimated_hours INT,
      rating DECIMAL(2,1) DEFAULT 0.0,
      reviews_count INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // 4. BẢNG SECTIONS
  await t`
    CREATE TABLE IF NOT EXISTS sections (
      id SERIAL PRIMARY KEY,
      course_id INT REFERENCES courses(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      order_index INT NOT NULL
    );
  `;

  // 5. BẢNG LESSONS
  await t`
    CREATE TABLE IF NOT EXISTS lessons (
      id SERIAL PRIMARY KEY,
      section_id INT REFERENCES sections(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      duration_minutes INT,
      xp_reward INT DEFAULT 0,
      lesson_type VARCHAR(50) DEFAULT 'video',
      content_html TEXT,
      video_url TEXT,
      order_index INT NOT NULL
    );
  `;

  // 6. BẢNG ENROLLMENTS (Tiến độ chung Khóa học)
  await t`
    CREATE TABLE IF NOT EXISTS enrollments (
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      course_id INT REFERENCES courses(id) ON DELETE CASCADE,
      progress_percent INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'ACTIVE',
      enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_accessed_at TIMESTAMP,
      PRIMARY KEY (user_id, course_id)
    );
  `;

  // 7. BẢNG USER_LESSON_PROGRESS (Tiến độ từng Bài học)
  await t`
    CREATE TABLE IF NOT EXISTS user_lesson_progress (
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
      status VARCHAR(50) DEFAULT 'LOCKED',
      completed_at TIMESTAMP,
      PRIMARY KEY (user_id, lesson_id)
    );
  `;

  // 8. BẢNG QUIZZES
  await t`
    CREATE TABLE IF NOT EXISTS quizzes (
      id SERIAL PRIMARY KEY,
      lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      passing_score INT DEFAULT 50,
      xp_reward INT DEFAULT 0
    );
  `;

  // 9. BẢNG QUESTIONS (Lưu dạng JSON câu trả lời)
  await t`
    CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      quiz_id INT REFERENCES quizzes(id) ON DELETE CASCADE,
      question_type VARCHAR(50) NOT NULL,
      question_text TEXT NOT NULL,
      explanation TEXT,
      metadata JSONB,
      correct_answer TEXT NOT NULL,
      order_index INT NOT NULL
    );
  `;

  // 10. BẢNG ACHIEVEMENTS
  await t`
    CREATE TABLE IF NOT EXISTS achievements (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      icon_name VARCHAR(50),
      rarity VARCHAR(50) DEFAULT 'COMMON',
      theme_color VARCHAR(50),
      unlock_condition JSONB
    );
  `;

  // 11. BẢNG USER_ACHIEVEMENTS
  await t`
    CREATE TABLE IF NOT EXISTS user_achievements (
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      achievement_id INT REFERENCES achievements(id) ON DELETE CASCADE,
      unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, achievement_id)
    );
  `;

  console.log('Tạo Schema thành công!');

  // --- SEED DATA MẪU ---

  const hashedPassword = await bcrypt.hash('123456', 10);

  // 1. Nạp Users
  await t`
    INSERT INTO users (id, name, email, password_hash, is_onboarded, total_xp)
    VALUES 
      ('410544b2-4001-4271-9855-fec4b6a6442a', 'Admin User', 'admin@learnquest.com', ${hashedPassword}, true, 500),
      ('5c4b1827-0cc6-4eb1-b956-628d022b3e41', 'Student A', 'studenta@learnquest.com', ${hashedPassword}, false, 150),
      ('8a892b1d-0cc6-4eb1-b956-628d022b3e42', 'Student B', 'studentb@learnquest.com', ${hashedPassword}, true, 800)
    ON CONFLICT (email) DO NOTHING;
  `;
  console.log('Đã nạp mẫu Users');

  // 2. Nạp Categories
  await t`
    INSERT INTO categories (id, name, slug)
    VALUES 
      (1, 'Mathematics', 'mathematics'),
      (2, 'Physics', 'physics'),
      (3, 'Computer Science', 'computer-science'),
      (4, 'History', 'history')
    ON CONFLICT (id) DO NOTHING;
  `;
  console.log('Đã nạp mẫu Categories');

  // 3. Nạp Courses
  await t`
    INSERT INTO courses (id, category_id, name, description, level, icon_name, theme_color, estimated_hours, rating, reviews_count)
    VALUES 
      (1, 1, 'Advanced Calculus', 'Master derivatives, integrals, and differential equations', 'Advanced', 'calculator', 'blue', 8, 4.8, 120),
      (2, 2, 'Quantum Physics', 'Explore quantum mechanics and particle behavior', 'Advanced', 'atom', 'purple', 6, 4.9, 85),
      (3, 3, 'Intro to React', 'Learn modern web development', 'Beginner', 'code', 'cyan', 10, 4.7, 210)
    ON CONFLICT (id) DO NOTHING;
  `;
  console.log('Đã nạp mẫu Courses');

  // 4. Nạp Sections
  await t`
    INSERT INTO sections (id, course_id, title, order_index)
    VALUES 
      (1, 1, 'Derivatives Basics', 1),
      (2, 1, 'Integration Mastery', 2),
      (3, 3, 'Component Architecture', 1)
    ON CONFLICT (id) DO NOTHING;
  `;

  // 5. Nạp Lessons (Có phân loại Video & Docs)
  await t`
    INSERT INTO lessons (id, section_id, title, duration_minutes, xp_reward, lesson_type, content_html, video_url, order_index)
    VALUES 
      (1, 1, 'What is a Derivative?', 15, 50, 'video', 'Introduction to derivatives concepts.', 'https://youtube.com/watch?v=1', 1),
      (2, 1, 'Power Rule', 10, 30, 'video', 'Learn the power rule shortcut.', 'https://youtube.com/watch?v=2', 2),
      (3, 3, 'Understanding JSX', 20, 100, 'doc', '<h1>JSX Basics</h1><p>JSX is syntax extension...</p>', NULL, 1)
    ON CONFLICT (id) DO NOTHING;
  `;

  // 6. Nạp Quizzes & Questions
  await t`
    INSERT INTO quizzes (id, lesson_id, title, passing_score, xp_reward)
    VALUES 
      (1, 1, 'Derivative Fundamentals Quiz', 80, 150),
      (2, 3, 'React JSX Knowledge Check', 100, 200)
    ON CONFLICT (id) DO NOTHING;
  `;

  await t`
    INSERT INTO questions (id, quiz_id, question_type, question_text, explanation, metadata, correct_answer, order_index)
    VALUES 
      (1, 1, 'multiple-choice', 'What is the derivative of x^2?', 'Power rule: bring down the 2 and subtract 1 from exponent.', '{"options": ["x", "2x", "x^3", "2"]}', '1', 1),
      (2, 1, 'true-false', 'The derivative of a constant is always 0.', 'Constants do not change, so their rate of change is 0.', NULL, 'true', 2),
      (3, 2, 'multiple-choice', 'Which HTML attribute becomes className in JSX?', 'class becomes className to avoid conflicts with JS keyword.', '{"options": ["class", "id", "href"]}', '0', 1)
    ON CONFLICT (id) DO NOTHING;
  `;

  // 7. Nạp Achievements
  await t`
    INSERT INTO achievements (id, title, description, icon_name, rarity, theme_color, unlock_condition)
    VALUES 
      (1, 'First Blood', 'Complete your very first lesson.', 'zap', 'COMMON', 'bg-yellow-100', '{"type": "lesson_count", "value": 1}'),
      (2, 'Math Wizard', 'Complete 5 Math lessons.', 'calculator', 'RARE', 'bg-blue-100', '{"type": "category_lesson_count", "category": "Mathematics", "value": 5}'),
      (3, 'React Master', 'Pass the React Quiz perfectly.', 'award', 'EPIC', 'bg-purple-100', '{"type": "quiz_score", "quiz_id": 2, "value": 100}')
    ON CONFLICT (id) DO NOTHING;
  `;

  // 8. Nạp Dữ liệu Mối quan hệ User (Tiến độ & Đăng ký)
  await t`
    INSERT INTO enrollments (user_id, course_id, progress_percent, status)
    VALUES 
      ('410544b2-4001-4271-9855-fec4b6a6442a', 1, 50, 'ACTIVE'),
      ('410544b2-4001-4271-9855-fec4b6a6442a', 3, 10, 'ACTIVE'),
      ('5c4b1827-0cc6-4eb1-b956-628d022b3e41', 1, 100, 'COMPLETED')
    ON CONFLICT (user_id, course_id) DO NOTHING;
  `;

  await t`
    INSERT INTO user_lesson_progress (user_id, lesson_id, status)
    VALUES 
      ('410544b2-4001-4271-9855-fec4b6a6442a', 1, 'COMPLETED'),
      ('410544b2-4001-4271-9855-fec4b6a6442a', 2, 'UNLOCKED'),
      ('5c4b1827-0cc6-4eb1-b956-628d022b3e41', 1, 'COMPLETED')
    ON CONFLICT (user_id, lesson_id) DO NOTHING;
  `;

  await t`
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES 
      ('410544b2-4001-4271-9855-fec4b6a6442a', 1),
      ('5c4b1827-0cc6-4eb1-b956-628d022b3e41', 1)
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  `;

  console.log('Đã nạp toàn bộ dữ liệu quan hệ mẫu (Quizzes, Enrollments, Progress)');
}

export async function GET() {
  try {
    await sql.begin(async (t) => {
      await seedDatabase(t);
    });

    return Response.json({ message: 'Khởi tạo Cơ sở dữ liệu LearnQuest thành công!' });
  } catch (error) {
    console.error('Lỗi khi Seed database:', error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
