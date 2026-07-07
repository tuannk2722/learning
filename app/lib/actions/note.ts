"use server";

import { db } from "../db";
import { lesson_notes } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function saveNote(lessonId: string, content: string): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    await db.insert(lesson_notes)
      .values({
        user_id: userId,
        lesson_id: Number(lessonId),
        content,
        updated_at: new Date(),
      })
      .onConflictDoUpdate({
        target: [lesson_notes.user_id, lesson_notes.lesson_id],
        set: {
          content,
          updated_at: new Date(),
        }
      });

    return { success: true };
  } catch (error) {
    console.error("Error saving note:", error);
    return { success: false, message: "Failed to save note" };
  }
}

export async function deleteNote(lessonId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    await db.delete(lesson_notes)
      .where(
        and(
          eq(lesson_notes.user_id, userId),
          eq(lesson_notes.lesson_id, Number(lessonId))
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { success: false, message: "Failed to delete note" };
  }
}
