'use server';

import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { unstable_update } from "@/auth";
import { evaluateAchievements } from "./achievements";
import { logActivity } from "./activity-log";

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

    await evaluateAchievements(userId);

    void logActivity({
      userId,
      action: 'COMPLETE_ONBOARDING',
      entityType: 'user',
      entityName: data.name,
    });

    revalidatePath('/onboarding');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to update onboarding:', error);
    return { success: false, error: 'Failed to update profile.' };
  }
}

export async function updateUserProfile(userId: string, data: {
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
      })
      .where(eq(users.id, userId));

    revalidatePath('/dashboard/profile');

    void logActivity({
      userId,
      action: 'UPDATE_PROFILE',
      entityType: 'user',
      entityName: data.name,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to update user profile:', error);
    return { success: false, error: 'Failed to update profile.' };
  }
}



