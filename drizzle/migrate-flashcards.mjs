// Script để chạy migration cho 4 bảng flashcard mới
// Chạy: node drizzle/migrate-flashcards.mjs
import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.POSTGRES_URL, { prepare: false });

const flashcardSQL = `
CREATE TABLE IF NOT EXISTS "flashcard_sets" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
  "owner_id" uuid NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "is_public" boolean DEFAULT true NOT NULL,
  "theme_color" varchar(50) DEFAULT 'blue',
  "tags" text[] DEFAULT '{}'::text[],
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "flashcard_items" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
  "set_id" uuid NOT NULL,
  "front" text NOT NULL,
  "back" text NOT NULL,
  "image_url" text,
  "order_index" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "flashcard_access_log" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL,
  "set_id" uuid NOT NULL,
  "accessed_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "flashcard_card_progress" (
  "user_id" uuid NOT NULL,
  "set_id" uuid NOT NULL,
  "card_id" uuid NOT NULL,
  "status" varchar(20) NOT NULL,
  "updated_at" timestamp DEFAULT now(),
  CONSTRAINT "flashcard_card_progress_user_id_card_id_pk" PRIMARY KEY("user_id","card_id")
);

ALTER TABLE "flashcard_sets" DROP CONSTRAINT IF EXISTS "flashcard_sets_owner_id_users_id_fk";
ALTER TABLE "flashcard_sets" ADD CONSTRAINT "flashcard_sets_owner_id_users_id_fk" 
  FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "flashcard_items" DROP CONSTRAINT IF EXISTS "flashcard_items_set_id_flashcard_sets_id_fk";
ALTER TABLE "flashcard_items" ADD CONSTRAINT "flashcard_items_set_id_flashcard_sets_id_fk" 
  FOREIGN KEY ("set_id") REFERENCES "public"."flashcard_sets"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "flashcard_access_log" DROP CONSTRAINT IF EXISTS "flashcard_access_log_user_id_users_id_fk";
ALTER TABLE "flashcard_access_log" ADD CONSTRAINT "flashcard_access_log_user_id_users_id_fk" 
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "flashcard_access_log" DROP CONSTRAINT IF EXISTS "flashcard_access_log_set_id_flashcard_sets_id_fk";
ALTER TABLE "flashcard_access_log" ADD CONSTRAINT "flashcard_access_log_set_id_flashcard_sets_id_fk" 
  FOREIGN KEY ("set_id") REFERENCES "public"."flashcard_sets"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "flashcard_card_progress" DROP CONSTRAINT IF EXISTS "flashcard_card_progress_user_id_users_id_fk";
ALTER TABLE "flashcard_card_progress" ADD CONSTRAINT "flashcard_card_progress_user_id_users_id_fk" 
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "flashcard_card_progress" DROP CONSTRAINT IF EXISTS "flashcard_card_progress_set_id_flashcard_sets_id_fk";
ALTER TABLE "flashcard_card_progress" ADD CONSTRAINT "flashcard_card_progress_set_id_flashcard_sets_id_fk" 
  FOREIGN KEY ("set_id") REFERENCES "public"."flashcard_sets"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "flashcard_card_progress" DROP CONSTRAINT IF EXISTS "flashcard_card_progress_card_id_flashcard_items_id_fk";
ALTER TABLE "flashcard_card_progress" ADD CONSTRAINT "flashcard_card_progress_card_id_flashcard_items_id_fk" 
  FOREIGN KEY ("card_id") REFERENCES "public"."flashcard_items"("id") ON DELETE cascade ON UPDATE no action;

CREATE INDEX IF NOT EXISTS "flashcard_sets_owner_idx" ON "flashcard_sets" USING btree ("owner_id");
CREATE INDEX IF NOT EXISTS "flashcard_items_set_idx" ON "flashcard_items" USING btree ("set_id");
CREATE INDEX IF NOT EXISTS "flashcard_access_log_user_set_idx" ON "flashcard_access_log" USING btree ("user_id","set_id");
CREATE INDEX IF NOT EXISTS "flashcard_card_progress_set_user_idx" ON "flashcard_card_progress" USING btree ("set_id","user_id");
`;

try {
  await sql.unsafe(flashcardSQL);
  console.log('✅ Flashcard tables created successfully!');
} catch (err) {
  console.error('❌ Migration failed:', err.message);
} finally {
  await sql.end();
}
