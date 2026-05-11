'use server';

import { db } from "../db";
import { daily_quest_definitions, user_daily_quests, users } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { QuestUpdateInfo, QuestType } from "../definitions/quests";
import { updateStreak } from "./streak";

const getTodayString = () => new Date().toISOString().split('T')[0];

/**
 * Gọi sau mỗi hành động của user để cập nhật tiến độ các quest liên quan.
 * @param questType - Loại quest cần cập nhật (COMPLETE_LESSONS, EARN_XP, v.v.)
 * @param incrementValue - Giá trị cộng thêm vào tiến độ
 */
export async function updateQuestProgress(
  questType: QuestType,
  incrementValue: number,
  userId: string
): Promise<{ questUpdates: QuestUpdateInfo[] }> {

  const today = getTodayString();
  const questUpdates: QuestUpdateInfo[] = [];

  // Lấy các quest chưa hoàn thành hôm nay có cùng quest_type
  const activeQuests = await db
    .select({
      userQuestId: user_daily_quests.id,
      current_progress: user_daily_quests.current_progress,
      target_value: daily_quest_definitions.target_value,
      reward_xp: daily_quest_definitions.reward_xp,
      title: daily_quest_definitions.title,
    })
    .from(user_daily_quests)
    .innerJoin(daily_quest_definitions, eq(user_daily_quests.quest_id, daily_quest_definitions.id))
    .where(and(
      eq(user_daily_quests.user_id, userId),
      eq(user_daily_quests.quest_date, today),
      eq(user_daily_quests.is_completed, false),
      eq(daily_quest_definitions.quest_type, questType),
    ));

  for (const quest of activeQuests) {
    const newProgress = (quest.current_progress || 0) + incrementValue;
    const isNowCompleted = newProgress >= quest.target_value;
    const finalProgress = Math.min(newProgress, quest.target_value);

    await db.update(user_daily_quests)
      .set({
        current_progress: finalProgress,
        is_completed: isNowCompleted,
        completed_at: isNowCompleted ? new Date() : undefined,
        reward_claimed: isNowCompleted, // Auto-claim reward
      })
      .where(eq(user_daily_quests.id, quest.userQuestId));

    // Cộng XP cho user nếu hoàn thành quest
    if (isNowCompleted) {
      await db.update(users)
        .set({ total_xp: sql`COALESCE(${users.total_xp}, 0) + ${quest.reward_xp}` })
        .where(eq(users.id, userId));

      // Hoàn thành quest cũng tính là có học hôm nay
      await updateStreak(userId);
    }

    questUpdates.push({
      title: quest.title,
      reward_xp: quest.reward_xp,
      current_progress: finalProgress,
      target_value: quest.target_value,
      is_completed: isNowCompleted
    });
  }

  return { questUpdates };
}
