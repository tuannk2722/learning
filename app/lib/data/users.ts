import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import type { User, UserInfoLogin } from "../definitions/user";

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


