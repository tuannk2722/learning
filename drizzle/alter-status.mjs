import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.POSTGRES_URL, { prepare: false });

try {
  await sql.unsafe(`
    ALTER TABLE flashcard_card_progress ALTER COLUMN status DROP NOT NULL;
  `);
  console.log('✅ Altered status column of flashcard_card_progress to nullable!');
} catch (err) {
  console.error('❌ Error altering column:', err.message);
} finally {
  await sql.end();
}
