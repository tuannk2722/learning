import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.POSTGRES_URL, { prepare: false });

try {
  await sql.unsafe(`
    DROP TABLE IF EXISTS flashcard_card_progress CASCADE;
    DROP TABLE IF EXISTS flashcard_access_log CASCADE;
    DROP TABLE IF EXISTS flashcard_items CASCADE;
    DROP TABLE IF EXISTS flashcard_sets CASCADE;
  `);
  console.log('✅ Dropped old flashcard tables');
} catch (err) {
  console.error('❌ Error:', err.message);
} finally {
  await sql.end();
}
