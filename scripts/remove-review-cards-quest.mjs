import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error('❌ POSTGRES_URL not found in .env!');
  process.exit(1);
}

const sql = postgres(connectionString);

async function removeQuest() {
  try {
    console.log('⏳ Removing REVIEW_FLASHCARDS quest from database...');

    // Delete user quests referencing this quest definition
    await sql`
      DELETE FROM user_daily_quests
      WHERE quest_id IN (
        SELECT id FROM daily_quest_definitions WHERE quest_type = 'REVIEW_FLASHCARDS'
      )
    `;

    // Delete definition
    await sql`
      DELETE FROM daily_quest_definitions WHERE quest_type = 'REVIEW_FLASHCARDS'
    `;

    console.log('✅ Successfully removed REVIEW_FLASHCARDS quest!');
  } catch (err) {
    console.error('❌ Error removing quest:', err);
  } finally {
    await sql.end();
  }
}

removeQuest();
