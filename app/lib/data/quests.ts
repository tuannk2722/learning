import { db } from "../db";
import { daily_quest_definitions, user_daily_quests } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { DailyQuest } from "../definitions/quests";

function getTodayString() {
  return new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

/** Lấy (hoặc tạo mới) 3 quest ngẫu nhiên cho user trong ngày hôm nay */
export async function getOrAssignDailyQuests(userId: string): Promise<DailyQuest[]> {
  const today = getTodayString();

  // 1. Kiểm tra xem user đã có quest hôm nay chưa
  const existing = await db
    .select({
      id: user_daily_quests.id,
      quest_id: user_daily_quests.quest_id,
      title: daily_quest_definitions.title,
      description: daily_quest_definitions.description,
      icon_name: daily_quest_definitions.icon_name,
      quest_type: daily_quest_definitions.quest_type,
      target_value: daily_quest_definitions.target_value,
      reward_xp: daily_quest_definitions.reward_xp,
      current_progress: user_daily_quests.current_progress,
      is_completed: user_daily_quests.is_completed,
      reward_claimed: user_daily_quests.reward_claimed,
    })
    .from(user_daily_quests)
    .innerJoin(daily_quest_definitions, eq(user_daily_quests.quest_id, daily_quest_definitions.id))
    .where(and(
      eq(user_daily_quests.user_id, userId),
      eq(user_daily_quests.quest_date, today)
    ));

  if (existing.length > 0) {
    return existing as DailyQuest[];
  }

  // 2. Chưa có → Random chọn 3 quest từ definitions
  const allDefinitions = await db.select().from(daily_quest_definitions);
  const shuffled = allDefinitions.sort(() => Math.random() - 0.5).slice(0, 3);

  // 3. Tạo bản ghi trong user_daily_quests
  await db.insert(user_daily_quests).values(
    shuffled.map((q) => ({
      user_id: userId,
      quest_id: q.id,
      quest_date: today,
      current_progress: 0,
      is_completed: false,
      reward_claimed: false,
    }))
  );

  // 4. Trả về danh sách vừa tạo
  const created = await db
    .select({
      id: user_daily_quests.id,
      quest_id: user_daily_quests.quest_id,
      title: daily_quest_definitions.title,
      description: daily_quest_definitions.description,
      icon_name: daily_quest_definitions.icon_name,
      quest_type: daily_quest_definitions.quest_type,
      target_value: daily_quest_definitions.target_value,
      reward_xp: daily_quest_definitions.reward_xp,
      current_progress: user_daily_quests.current_progress,
      is_completed: user_daily_quests.is_completed,
      reward_claimed: user_daily_quests.reward_claimed,
    })
    .from(user_daily_quests)
    .innerJoin(daily_quest_definitions, eq(user_daily_quests.quest_id, daily_quest_definitions.id))
    .where(and(
      eq(user_daily_quests.user_id, userId),
      eq(user_daily_quests.quest_date, today)
    ));

  return created as DailyQuest[];
}
