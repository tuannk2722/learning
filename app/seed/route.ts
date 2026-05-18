import bcrypt from 'bcrypt';
import { db } from '@/app/lib/db';
import * as schema from '@/app/lib/db/schema';
import { sql } from 'drizzle-orm';

async function clearData() {
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
}

async function seedUsers() {
  const hashedPassword = await bcrypt.hash('123456', 10);
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
}

async function seedCategoriesAndCourses() {
  console.log('Seeding categories...');
  await db.insert(schema.categories).values([
    { id: 1, name: 'Web Development', slug: 'web-dev' },
    { id: 2, name: 'Data Science', slug: 'data-science' },
    { id: 3, name: 'Mobile App', slug: 'mobile-app' },
    { id: 4, name: 'Cyber Security', slug: 'cyber-security' },
  ]);

  console.log('Seeding courses...');
  await db.insert(schema.courses).values([
    { id: 1, category_id: 1, name: 'React for Beginners', description: 'Master the basics of React.js from scratch. Learn components, props, state, and hooks through hands-on projects.', level: 'Beginner', icon_name: 'atom', theme_color: 'blue', estimated_hours: 10, rating: '4.8', reviews_count: 120 },
    { id: 2, category_id: 1, name: 'Advanced Next.js', description: 'Take your Next.js skills to the next level. Master Server Components, App Router, and complex data fetching patterns.', level: 'Advanced', icon_name: 'zap', theme_color: 'black', estimated_hours: 15, rating: '4.9', reviews_count: 85 },
    { id: 3, category_id: 2, name: 'Python for Data Science', description: 'Learn Python programming specifically for data analysis. Master libraries like NumPy, Pandas, and Matplotlib.', level: 'Intermediate', icon_name: 'database', theme_color: 'yellow', estimated_hours: 20, rating: '4.7', reviews_count: 200 },
  ]);

  console.log('Seeding sections...');
  await db.insert(schema.sections).values([
    // Course 1 Sections
    { id: 1, course_id: 1, title: 'Introduction to React', order_index: 1 },
    { id: 2, course_id: 1, title: 'State & Props', order_index: 2 },
    { id: 3, course_id: 1, title: 'Handling Events', order_index: 3 },
    // Course 2 Sections
    { id: 4, course_id: 2, title: 'Server Components Deep Dive', order_index: 1 },
    { id: 5, course_id: 2, title: 'Advanced Routing', order_index: 2 },
    // Course 3 Sections
    { id: 6, course_id: 3, title: 'Python Fundamentals', order_index: 1 },
    { id: 7, course_id: 3, title: 'Data Analysis with Pandas', order_index: 2 },
  ]);

  console.log('Seeding lessons...');
  await db.insert(schema.lessons).values([
    // Course 1, Section 1
    { 
      id: 1, 
      section_id: 1, 
      title: 'What is React?', 
      duration_minutes: 10, 
      xp_reward: 50, 
      order_index: 1,
      lesson_type: 'video',
      content: `
# Welcome to React
React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called “components”.

### Why React?
* **Declarative**: React makes it painless to create interactive UIs.
* **Component-Based**: Build encapsulated components that manage their own state.
* **Learn Once, Write Anywhere**: You can develop new features in React without rewriting existing code.
      `,
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    { 
      id: 2, 
      section_id: 1, 
      title: 'JSX and Elements', 
      duration_minutes: 12, 
      xp_reward: 60, 
      order_index: 2,
      lesson_type: 'doc',
      content: `
# Introduction to JSX
JSX is a syntax extension to JavaScript. It looks like HTML but has the full power of JavaScript.

### Example
\`\`\`jsx
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;
\`\`\`

JSX prevents Injection Attacks by default, making your application more secure.
      `
    },
    { 
      id: 3, 
      section_id: 1, 
      title: 'Functional Components', 
      duration_minutes: 15, 
      xp_reward: 75, 
      order_index: 3, 
      lesson_type: 'doc',
      content: `
# Functional Components
Components are the building blocks of React. The simplest way to define a component is to write a JavaScript function.

\`\`\`javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
\`\`\`
      ` 
    },
    
    // Course 1, Section 2
    { id: 4, section_id: 2, title: 'The useState Hook', duration_minutes: 20, xp_reward: 100, order_index: 1, lesson_type: 'doc', content: '# useState Hook\nState is like a "memory" for your component.' },
    { id: 5, section_id: 2, title: 'Passing Data with Props', duration_minutes: 18, xp_reward: 90, order_index: 2, lesson_type: 'doc', content: '# Props in React\nProps are read-only and allow you to pass data down.' },
    
    // Course 1, Section 3
    { id: 6, section_id: 3, title: 'OnClick & Input Events', duration_minutes: 15, xp_reward: 75, order_index: 1, lesson_type: 'doc', content: '# Handling Events\nReact events are named using camelCase.' },
    
    // Course 2, Section 4
    { id: 7, section_id: 4, title: 'Server vs Client Components', duration_minutes: 25, xp_reward: 150, order_index: 1, lesson_type: 'video', content: '# Next.js Components\nLearn the difference between Server and Client rendering.' },
    { id: 8, section_id: 4, title: 'Streaming with Suspense', duration_minutes: 22, xp_reward: 130, order_index: 2, lesson_type: 'doc', content: '# Streaming\nImprove perceived performance with Suspense.' },
    
    // Course 2, Section 5
    { id: 9, section_id: 5, title: 'Dynamic Routes & Catch-all', duration_minutes: 20, xp_reward: 120, order_index: 1, lesson_type: 'doc', content: '# Dynamic Routing\nHandle variable segments in your URLs.' },

    // Course 3, Section 6
    { id: 10, section_id: 6, title: 'Variables & Data Types', duration_minutes: 12, xp_reward: 50, order_index: 1, lesson_type: 'doc', content: '# Python Variables\nDynamic typing in Python.' },
    { id: 11, section_id: 6, title: 'Lists, Tuples, and Dictionaries', duration_minutes: 18, xp_reward: 80, order_index: 2, lesson_type: 'doc', content: '# Collections\nStore multiple items in a single variable.' },
    { id: 12, section_id: 6, title: 'Loops and Conditionals', duration_minutes: 15, xp_reward: 70, order_index: 3, lesson_type: 'doc', content: '# Logic Flow\nif, else, for, while.' },
    
    // Course 3, Section 7
    { id: 13, section_id: 7, title: 'DataFrames Basics', duration_minutes: 25, xp_reward: 150, order_index: 1, lesson_type: 'doc', content: '# Pandas DataFrames\nThe core data structure for analysis.' },
    { id: 14, section_id: 7, title: 'Filtering and Sorting Data', duration_minutes: 22, xp_reward: 130, order_index: 2, lesson_type: 'doc', content: '# Data Manipulation\nSlice and dice your data.' },
  ]);

  await seedQuizzesAndQuestions();
}

async function seedQuizzesAndQuestions() {
  console.log('Seeding quizzes...');
  await db.insert(schema.quizzes).values([
    { id: 1, lesson_id: 1, title: 'React Basics Quiz', passing_score: 80 },
    { id: 2, lesson_id: 4, title: 'State & Hook Quiz', passing_score: 80 },
    { id: 3, lesson_id: 13, title: 'Pandas Basics Quiz', passing_score: 85 },
  ]).onConflictDoNothing();

  console.log('Seeding questions...');
  await db.insert(schema.questions).values([
    {
      id: 1,
      quiz_id: 1,
      question_type: 'multiple-choice',
      question_text: 'What is React?',
      explanation: 'React is a JavaScript library for building user interfaces.',
      metadata: { options: ['A Library', 'A Framework', 'A Language'] },
      correct_answer: '0',
      xp_reward: 100,
      order_index: 1,
    },
    {
      id: 2,
      quiz_id: 2,
      question_type: 'multiple-choice',
      question_text: 'Which hook is used for state management?',
      explanation: 'useState is the primary hook for managing state in functional components.',
      metadata: { options: ['useEffect', 'useState', 'useContext'] },
      correct_answer: '1',
      xp_reward: 150,
      order_index: 1,
    },
    {
      id: 3,
      quiz_id: 3,
      question_type: 'multiple-choice',
      question_text: 'What is a DataFrame in Pandas?',
      explanation: 'A DataFrame is a 2-dimensional labeled data structure with columns of potentially different types.',
      metadata: { options: ['A 1D array', 'A 2D table', 'A Database'] },
      correct_answer: '1',
      xp_reward: 50,
      order_index: 1,
    },
    {
      id: 4,
      quiz_id: 3,
      question_type: "multiple-choice",
      question_text: "What is the primary purpose of the topic discussed in this lesson?",
      metadata: { options: ["Option A: To simplify code", "Option B: To improve performance", "Option C: To enhance security", "Option D: All of the above"] },
      correct_answer: "3", 
      explanation: "The topic covers various aspects including simplification, performance, and security.",
      order_index: 2,
    },
    {
      id: 5,
      quiz_id: 3,
      question_type: "true-false",
      question_text: "Is it true that the concepts in this lesson are considered best practices in modern development?",
      metadata: {},
      correct_answer: "true",
      explanation: "Yes, these concepts are fundamental and widely adopted.",
      order_index: 3,
    },
    {
      id: 6,
      quiz_id: 3,
      question_type: "multiple-choice",
      question_text: "Which of the following is a common mistake when implementing this feature?",
      metadata: { options: ["Not testing enough", "Ignoring edge cases", "Premature optimization", "All of the above"] },
      correct_answer: "3",
      explanation: "Developers often encounter these challenges when first learning this topic.",
      order_index: 4,
    },
    {
      id: 7,
      quiz_id: 3,
      question_type: "multiple-choice",
      question_text: "What is the complexity of the standard approach mentioned in the lesson?",
      metadata: { options: ["O(1)", "O(n)", "O(log n)", "It depends on implementation"] },
      correct_answer: "3",
      explanation: "Implementation details can vary based on specific requirements.",
      order_index: 5,
    },
    {
      id: 8,
      quiz_id: 3,
      question_type: "true-false",
      question_text: "Can this feature be used in mobile development?",
      metadata: {},
      correct_answer: "true",
      explanation: "Yes, it is cross-platform and works well on mobile devices.",
      order_index: 6,
    },
    {
      id: 9,
      quiz_id: 3,
      question_type: "multiple-choice",
      question_text: "Which keyword is most associated with this topic?",
      metadata: { options: ["function", "const", "class", "async"] },
      correct_answer: "1",
      explanation: "Immutability is often a key part of the discussion.",
      order_index: 7,
    },
    {
      id: 10,
      quiz_id: 3,
      question_type: "fill-blank",
      question_text: "The technique described in the lesson is often called '____ programming'.",
      metadata: {},
      correct_answer: "functional",
      explanation: "Functional programming is a common paradigm related to many modern web concepts.",
      order_index: 8,
    },
    {
      id: 11,
      quiz_id: 3,
      question_type: "multiple-choice",
      question_text: "What is the main benefit of using this approach?",
      metadata: { options: ["Less code", "More readable", "Easier to maintain", "All of the above"] },
      correct_answer: "3",
      explanation: "Combining these benefits makes it a superior choice.",
      order_index: 9,
    },
    {
      id: 12,
      quiz_id: 3,
      question_type: "true-false",
      question_text: "Is this feature supported in all modern browsers?",
      metadata: {},
      correct_answer: "true",
      explanation: "Modern browsers have excellent support for these standards.",
      order_index: 10,
    },
    {
      id: 13,
      quiz_id: 3,
      question_type: "code",
      question_text: "What will be the output of this simplified example?",
      metadata: { code: "const x = 10;\nconsole.log(x + 5);", options: ["10", "15", "5", "error"] },
      correct_answer: "1",
      explanation: "Basic addition results in 15.",
      order_index: 11,
    },
    {
      id: 14,
      quiz_id: 3,
      question_type: "code",
      question_text: "What will be the output of this simplified example (Part 2)?",
      metadata: { code: "const x = 10;\nconsole.log(x * 5);", options: ["10", "15", "50", "error"] },
      correct_answer: "2",
      explanation: "Basic multiplication results in 50.",
      order_index: 12,
    }
  ]);
}

async function seedAchievements() {
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
      title: 'Explorer Started',
      description: 'Complete the onboarding process.',
      icon_name: 'user',
      rarity: 'COMMON',
      theme_color: 'bg-blue-100',
      unlock_condition: { type: 'onboarding', value: true },
    },
    {
      id: 3,
      title: 'Course Finisher',
      description: 'Complete your first entire course.',
      icon_name: 'book-open',
      rarity: 'RARE',
      theme_color: 'bg-emerald-100',
      unlock_condition: { type: 'course_count', value: 1 },
    },
    {
      id: 4,
      title: 'Rising Star',
      description: 'Reach Level 5.',
      icon_name: 'trending-up',
      rarity: 'COMMON',
      theme_color: 'bg-indigo-100',
      unlock_condition: { type: 'level', value: 5 },
    },
    {
      id: 5,
      title: 'Expert Learner',
      description: 'Reach Level 10.',
      icon_name: 'award',
      rarity: 'RARE',
      theme_color: 'bg-violet-100',
      unlock_condition: { type: 'level', value: 10 },
    },
    {
      id: 6,
      title: 'Power User',
      description: 'Reach Level 15.',
      icon_name: 'shield',
      rarity: 'EPIC',
      theme_color: 'bg-purple-100',
      unlock_condition: { type: 'level', value: 15 },
    },
    {
      id: 7,
      title: 'Grandmaster',
      description: 'Reach Level 20.',
      icon_name: 'crown',
      rarity: 'LEGENDARY',
      theme_color: 'bg-orange-100',
      unlock_condition: { type: 'level', value: 20 },
    },
    {
      id: 8,
      title: 'Perfect Score',
      description: 'Score 100% on your first quiz.',
      icon_name: 'check-circle',
      rarity: 'RARE',
      theme_color: 'bg-green-100',
      unlock_condition: { type: 'quiz_score', value: 100 },
    },
    {
      id: 9,
      title: 'The Number One',
      description: 'Reach Top 1 on the leaderboard.',
      icon_name: 'trophy',
      rarity: 'LEGENDARY',
      theme_color: 'bg-yellow-200',
      unlock_condition: { type: 'rank', value: 1 },
    },
    {
      id: 10,
      title: 'Top Ten Elite',
      description: 'Reach Top 10 on the leaderboard.',
      icon_name: 'medal',
      rarity: 'EPIC',
      theme_color: 'bg-amber-100',
      unlock_condition: { type: 'rank', value: 10 },
    },
    {
      id: 11,
      title: 'The Vanguards',
      description: 'Reach Top 20 on the leaderboard.',
      icon_name: 'target',
      rarity: 'RARE',
      theme_color: 'bg-blue-50',
      unlock_condition: { type: 'rank', value: 20 },
    },
    {
      id: 12,
      title: 'Unstoppable',
      description: 'Maintain a 7-day study streak.',
      icon_name: 'flame',
      rarity: 'EPIC',
      theme_color: 'bg-orange-200',
      unlock_condition: { type: 'streak', value: 7 },
    },
    {
      id: 13,
      icon_name: 'book-open',
      title: 'Knowledge Seeker',
      description: 'Study for 100 total hours',
      rarity: 'legendary',
      theme_color: 'bg-emerald-100',
      unlock_condition: { type: 'hours', value: 100 },
    },
    {
      id: 14,
      icon_name: 'award',
      title: 'Ultimate Scholar',
      description: 'Unlock all other achievements',
      rarity: 'mythic',
      theme_color: 'bg-violet-100',
      unlock_condition: { type: 'all', value: true },
    }
  ]);
}

async function seedRelations() {
  console.log('Seeding relations...');
  await db.insert(schema.enrollments).values([
    { user_id: '410544b2-4001-4271-9855-fec4b6a6442a', course_id: 1, progress_percent: 50, status: 'ACTIVE' },
    { user_id: '410544b2-4001-4271-9855-fec4b6a6442a', course_id: 3, progress_percent: 0, status: 'ACTIVE' },
    { user_id: '5c4b1827-0cc6-4eb1-b956-628d022b3e41', course_id: 1, progress_percent: 100, status: 'COMPLETED' },
  ]);

  await db.insert(schema.user_lesson_progress).values([
    { user_id: '410544b2-4001-4271-9855-fec4b6a6442a', lesson_id: 1, status: 'COMPLETED' },
    { user_id: '410544b2-4001-4271-9855-fec4b6a6442a', lesson_id: 2, status: 'UNLOCKED' },
    { user_id: '5c4b1827-0cc6-4eb1-b956-628d022b3e41', lesson_id: 1, status: 'COMPLETED' },
    { user_id: '5c4b1827-0cc6-4eb1-b956-628d022b3e41', lesson_id: 2, status: 'COMPLETED' },
  ]);

  await db.insert(schema.user_achievements).values([
    { user_id: '410544b2-4001-4271-9855-fec4b6a6442a', achievement_id: 1 },
    { user_id: '5c4b1827-0cc6-4eb1-b956-628d022b3e41', achievement_id: 1 },
  ]);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');

  try {
    if (target === 'content') {
      console.log('Clearing and seeding CONTENT only (preserving users)...');
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

      await seedCategoriesAndCourses();
      await seedAchievements();
      await seedRelations();

      return Response.json({ message: 'Content (Courses, Lessons, Achievements) updated successfully! Users preserved.' });
    }

    if (target === 'questions') {
      console.log('Clearing and seeding QUESTIONS only...');
      await db.delete(schema.questions);
      // We don't delete quizzes if we don't want to break existing lesson relations, 
      // but since seedQuizzesAndQuestions uses onConflictDoNothing for quizzes, it's safe to just clear questions.
      await seedQuizzesAndQuestions();
      return Response.json({ message: 'Seeded Questions only! Users and Courses preserved.' });
    }

    if (target === 'achievements') {
      await db.delete(schema.user_achievements);
      await db.delete(schema.achievements);
      await seedAchievements();
      return Response.json({ message: 'Seeded Achievements only!' });
    }

    if (target === 'users') {
      await db.delete(schema.users);
      await seedUsers();
      return Response.json({ message: 'Seeded Users only!' });
    }

    // Default behavior (Dangerous: clears everything)
    if (searchParams.get('force') === 'true') {
      await clearData();
      await seedUsers();
      await seedCategoriesAndCourses();
      await seedAchievements();
      await seedRelations();
      return Response.json({ message: 'Full database re-seeded successfully!' });
    }

    return Response.json({
      error: 'Please specify a target (e.g., ?target=achievements) or use ?force=true for full seed.'
    }, { status: 400 });

  } catch (error) {
    console.error('Seed Error:', error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

