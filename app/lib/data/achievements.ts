import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and } from "drizzle-orm";
import { Achievement } from "../definitions/definitions";

export async function getAchievements(userId?: string): Promise<Achievement[]> {
  try {
    let queryResult;

    // 1. Dùng LEFT JOIN để gom chung việc lấy danh sách và trạng thái mở khóa vào 1 query
    if (userId) {
      queryResult = await db
        .select({
          achievement: schema.achievements,
          unlocked_at: schema.user_achievements.unlocked_at,
        })
        .from(schema.achievements)
        .leftJoin(
          schema.user_achievements,
          and(
            eq(schema.achievements.id, schema.user_achievements.achievement_id),
            eq(schema.user_achievements.user_id, userId)
          )
        );
    } else {
      // Nếu chưa đăng nhập, chỉ query danh sách achievements (tất cả đều khóa)
      const allAchievements = await db.select().from(schema.achievements);
      queryResult = allAchievements.map((ach) => ({
        achievement: ach,
        unlocked_at: null,
      }));
    }

    // 2. Map sang format Achievement interface dùng ở frontend
    const achievementsList: Achievement[] = queryResult.map((row) => {
      const ach = row.achievement;
      const unlockedDate = row.unlocked_at;
      const isUnlocked = unlockedDate !== null;

      return {
        id: ach.id,
        icon: ach.icon_name || 'Trophy',
        title: ach.title,
        description: ach.description || '',
        unlocked: isUnlocked,
        unlockedDate: unlockedDate ? unlockedDate.toISOString() : null,
        rarity: ach.rarity || 'common',
        theme_color: ach.theme_color || 'gray',
        reward_xp: ach.reward_xp || 0,
      };
    });

    return achievementsList;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }
}
