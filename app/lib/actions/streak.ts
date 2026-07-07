'use server';

import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { StreakResult } from "../definitions/definitions";
import { getVNDateString } from "../utils/date";


/**
 * Trả về streak thực tế trên UI. Nếu quá hạn (không học ngày hôm qua), streak trả về 0.
 */
export async function getEffectiveStreak(currentStreak: number | null, lastStudyDate: Date | null): Promise<number> {
  if (!currentStreak || !lastStudyDate) return 0;

  const now = new Date();
  const todayStr = await getVNDateString(now);

  const yesterdayDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayStr = await getVNDateString(yesterdayDate);

  const lastStudyStr = await getVNDateString(lastStudyDate);

  // Nếu ngày học cuối là hôm nay hoặc hôm qua -> giữ nguyên streak
  if (lastStudyStr === todayStr || lastStudyStr === yesterdayStr) {
    return currentStreak;
  }

  // Đã bỏ lỡ từ 2 ngày trở lên -> streak thực tế là 0
  return 0;
}

/**
 * Cập nhật streak của user sau khi hoàn thành một activity (lesson / quiz / quest).
 * Hàm này an toàn để gọi nhiều lần trong ngày — chỉ tính streak 1 lần mỗi ngày.
 *
 * @param userId - UUID của user cần cập nhật
 * @returns StreakResult chứa trạng thái streak mới nhất
 */
export async function updateStreak(userId: string): Promise<StreakResult> {
  try {
    // 1. Lấy dữ liệu streak hiện tại của user
    const userData = await db
      .select({
        current_streak: users.current_streak,
        longest_streak: users.longest_streak,
        last_study_date: users.last_study_date,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userData.length === 0) {
      return {
        streakUpdated: false,
        currentStreak: 0,
        longestStreak: 0,
        isNewRecord: false,
      };
    }

    const { current_streak, longest_streak, last_study_date } = userData[0];
    const now = new Date();
    const todayStr = await getVNDateString(now);

    // 2. Kiểm tra last_study_date
    if (last_study_date) {
      const lastStudyStr = await getVNDateString(last_study_date);

      // Đã học hôm nay rồi → không tính thêm
      if (lastStudyStr === todayStr) {
        return {
          streakUpdated: false,
          currentStreak: current_streak ?? 0,
          longestStreak: longest_streak ?? 0,
          isNewRecord: false,
        };
      }

      // Tính "hôm qua" theo giờ VN
      const yesterdayDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const yesterdayStr = await getVNDateString(yesterdayDate);

      // 3. Xác định streak mới
      let newStreak: number;
      if (lastStudyStr === yesterdayStr) {
        // Học liên tiếp → tiếp tục streak
        newStreak = (current_streak ?? 0) + 1;
      } else {
        // Bị gián đoạn → reset
        newStreak = 1;
      }

      return await _saveAndReturn(userId, newStreak, longest_streak ?? 0);
    } else {
      // Chưa học lần nào → khởi tạo streak = 1
      return await _saveAndReturn(userId, 1, longest_streak ?? 0);
    }
  } catch (error) {
    console.error('[updateStreak] Error:', error);
    return {
      streakUpdated: false,
      currentStreak: 0,
      longestStreak: 0,
      isNewRecord: false,
    };
  }
}

/**
 * Helper: lưu streak mới vào DB và trả về kết quả.
 */
async function _saveAndReturn(
  userId: string,
  newStreak: number,
  oldLongest: number
): Promise<StreakResult> {
  const newLongest = Math.max(oldLongest, newStreak);
  const isNewRecord = newStreak > oldLongest;

  await db
    .update(users)
    .set({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_study_date: new Date(),
    })
    .where(eq(users.id, userId));

  return {
    streakUpdated: true,
    currentStreak: newStreak,
    longestStreak: newLongest,
    isNewRecord,
  };
}
