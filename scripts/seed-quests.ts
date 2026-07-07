import 'dotenv/config';
import { db } from '../app/lib/db';
import { daily_quest_definitions } from '../app/lib/db/schema';

const quests = [
  {
    title: 'Complete 1 lesson',
    description: 'Finish any 1 lesson today.',
    icon_name: 'BookOpen',
    quest_type: 'COMPLETE_LESSONS',
    target_value: 1,
    reward_xp: 30,
  },
  {
    title: 'Complete 3 lessons',
    description: 'Finish 3 lessons today.',
    icon_name: 'BookCheck',
    quest_type: 'COMPLETE_LESSONS',
    target_value: 3,
    reward_xp: 80,
  },
  {
    title: 'Earn 50 XP',
    description: 'Collect 50 XP in a single day.',
    icon_name: 'Zap',
    quest_type: 'EARN_XP',
    target_value: 50,
    reward_xp: 40,
  },
  {
    title: 'Earn 150 XP',
    description: 'Collect 150 XP in a single day.',
    icon_name: 'Zap',
    quest_type: 'EARN_XP',
    target_value: 150,
    reward_xp: 100,
  },
  {
    title: 'Pass 1 quiz',
    description: 'Pass any quiz today.',
    icon_name: 'Trophy',
    quest_type: 'PASS_QUIZ',
    target_value: 1,
    reward_xp: 60,
  },
  {
    title: 'Pass 2 quizzes',
    description: 'Pass 2 quizzes today.',
    icon_name: 'Trophy',
    quest_type: 'PASS_QUIZ',
    target_value: 2,
    reward_xp: 120,
  },
  {
    title: 'Study 15 minutes',
    description: 'Spend at least 15 minutes studying.',
    icon_name: 'Clock',
    quest_type: 'STUDY_TIME',
    target_value: 15,
    reward_xp: 50,
  },
];

async function main() {
  console.log('Seeding daily quest definitions...');
  await db.insert(daily_quest_definitions).values(quests).onConflictDoNothing();
  console.log(`✅ Seeded ${quests.length} quest definitions.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
