import { db } from "../db";
import { users } from "../db/schema";
import { eq, desc, sql } from "drizzle-orm";
import type { User, UserInfoLogin } from "../definitions/user";
import type { LeaderboardEntry } from "../definitions/definitions";
import { calculateLevel } from "../utils/xp";

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const user = await db.select().from(users).where(eq(users.id, id));

    if (user.length == 0) return undefined;
    return {
      ...user[0],
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      location: user[0].location,
      bio: user[0].bio,
      is_onboarded: user[0].is_onboarded ?? false,
      avatar_url: user[0].avatar_url,
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

      const currentStreak = user.current_streak || 0;
      const longestStreak = user.longest_streak || 0;

      let trend = 'same';
      if (currentStreak < longestStreak) {
        trend = 'down';
      } else if (currentStreak > 0 && currentStreak >= longestStreak) {
        trend = 'up';
      }

      return {
        rank: index + 1,
        name: user.name,
        level: levelObj.level,
        xp: user.total_xp || 0,
        streak: currentStreak,
        trend: trend,
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