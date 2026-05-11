'use server';

import { db } from "../db";
import { enrollments, sections, lessons, user_lesson_progress } from "../db/schema";
import { eq, and, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function enrollInCourse(courseId: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be logged in to enroll' };
    }
    const userId = session.user.id;

    // Check if already enrolled
    const existingEnrollment = await db
      .select()
      .from(enrollments)
      .where(and(
        eq(enrollments.user_id, userId),
        eq(enrollments.course_id, courseId)
      ))
      .limit(1);

    if (existingEnrollment.length > 0) {
      return { success: true, message: 'Already enrolled' };
    }

    // Enroll user
    await db.insert(enrollments).values({
      user_id: userId,
      course_id: courseId,
      progress_percent: 0,
      last_accessed_at: new Date(),
      status: 'ACTIVE',
    });

    // Find first lesson of the first section
    const firstSection = await db
      .select({ id: sections.id })
      .from(sections)
      .where(eq(sections.course_id, courseId))
      .orderBy(asc(sections.order_index))
      .limit(1);

    if (firstSection.length > 0) {
      const firstLesson = await db
        .select({ id: lessons.id })
        .from(lessons)
        .where(eq(lessons.section_id, firstSection[0].id))
        .orderBy(asc(lessons.order_index))
        .limit(1);

      if (firstLesson.length > 0) {
        // Unlock first lesson
        await db.insert(user_lesson_progress)
          .values({
            user_id: userId,
            lesson_id: firstLesson[0].id,
            status: 'unlocked',
          })
          .onConflictDoNothing();
      }
    }

    revalidatePath(`/dashboard/courses/${courseId}`);
    revalidatePath(`/dashboard/courses`);
    return { success: true, message: 'Successfully enrolled' };

  } catch (error) {
    console.error('Error enrolling in course:', error);
    return { success: false, message: 'Failed to enroll in course' };
  }
}

export async function updateLastAccessCourse(courseId: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) return;

    await db.update(enrollments)
      .set({ last_accessed_at: new Date() })
      .where(and(
        eq(enrollments.user_id, session.user.id),
        eq(enrollments.course_id, courseId)
      ));
  } catch (error) {
    console.error('Error updating last access:', error);
  }
}