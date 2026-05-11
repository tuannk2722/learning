import { db } from "../db";
import { users, enrollments, user_lesson_progress, lessons } from "../db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import type { User, UserInfoLogin } from "../definitions/user";
import type { LeaderboardEntry } from "../definitions/definitions";
import { calculateLevel } from "../utils/xp";

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        location: users.location,
        bio: users.bio,
        total_xp: users.total_xp,
        current_streak: users.current_streak,
        longest_streak: users.longest_streak,
        last_study_date: users.last_study_date,
        is_onboarded: users.is_onboarded,
        avatar_url: users.avatar_url,
        joinDate: users.created_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (user.length === 0) return undefined;

    return {
      ...user[0],
      is_onboarded: user[0].is_onboarded ?? false,
    } as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getUserByEmail(email: string): Promise<UserInfoLogin | undefined> {
  try {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (user.length === 0) return undefined;

    return {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      password_hash: user[0].password_hash,
      is_onboarded: user[0].is_onboarded ?? false,
    } as UserInfoLogin;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getLeaderboardData(currentUserId?: string): Promise<LeaderboardEntry[]> {
  try {
    const allUsers = await db.select().from(users).where(eq(users.is_onboarded, true)).orderBy(desc(users.total_xp));

    return allUsers.map((user, index) => {
      const levelObj = calculateLevel(user.total_xp || 0);

      const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'U';

      return {
        rank: index + 1,
        name: user.name,
        level: levelObj.level,
        xp: user.total_xp || 0,
        streak: user.current_streak || 0,
        isCurrentUser: currentUserId ? user.id === currentUserId : false,
        avatar: user.avatar_url || initials,
      };
    });
  } catch (error) {
    console.error('Failed to fetch leaderboard data:', error);
    throw new Error('Failed to fetch leaderboard data.');
  }
}

export async function getRankByUserId(userId: string): Promise<number> {
  try {
    const userResult = await db.select({ xp: users.total_xp }).from(users).where(eq(users.id, userId)).limit(1);
    if (!userResult.length) return 0;

    const userXp = userResult[0].xp || 0;

    const countResult = await db.select({ count: sql<number>`cast(count(*) as integer)` })
      .from(users)
      .where(sql`${users.total_xp} > ${userXp} AND ${users.is_onboarded} = true`);

    return Number(countResult[0].count) + 1;
  } catch (error) {
    console.error('Failed to get rank:', error);
    return 0;
  }
}

export async function getTop1User() {
  try {
    const topUsers = await db.select().from(users).where(eq(users.is_onboarded, true)).orderBy(desc(users.total_xp)).limit(1);
    if (!topUsers.length) return null;

    const user = topUsers[0];

    const lessonsResult = await db
      .select({
        count: sql<number>`count(*)`,
        minutes: sql<number>`sum(${lessons.duration_minutes})`
      })
      .from(user_lesson_progress)
      .innerJoin(lessons, eq(user_lesson_progress.lesson_id, lessons.id))
      .where(and(
        eq(user_lesson_progress.user_id, user.id),
        eq(user_lesson_progress.status, 'completed')
      ));

    const lessonsCompleted = Number(lessonsResult[0]?.count) || 0;
    const studyHours = Math.round((Number(lessonsResult[0]?.minutes) || 0) / 60);
    const levelObj = calculateLevel(user.total_xp || 0);
    const initials = user.name
      ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : 'U';

    return {
      avatar: user.avatar_url || initials,
      name: user.name,
      level: levelObj.level,
      total_xp: user.total_xp || 0,
      longest_streak: user.longest_streak || 0,
      current_streak: user.current_streak || 0,
      total_study_time: studyHours,
      lesson_completed: lessonsCompleted,
      level_progress: levelObj.progress,
    };
  } catch (error) {
    console.error('Failed to get top 1 user:', error);
    return null;
  }
}