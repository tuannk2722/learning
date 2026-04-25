'use server';

import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { unstable_update } from "@/auth";

export async function updateOnboarding(userId: string, data: {
  name: string;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
}) {
  try {
    await db.update(users)
      .set({
        name: data.name,
        bio: data.bio,
        location: data.location,
        avatar_url: data.avatar_url,
        is_onboarded: true,
      })
      .where(eq(users.id, userId));
    
    // Update the session token
    await unstable_update({
      user: {
        is_onboarded: true,
      }
    } as any);

    revalidatePath('/onboarding');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to update onboarding:', error);
    return { success: false, error: 'Failed to update profile.' };
  }
}
