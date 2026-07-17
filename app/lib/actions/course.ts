'use server';

import { db } from "../db";
import { enrollments, sections, lessons, user_lesson_progress, courses, categories, quizzes } from "../db/schema";
import { eq, and, asc, sql, isNotNull, inArray, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { evaluateAchievements } from "./achievements";
import { UnlockedAchievement } from "../definitions/definitions";
import { CourseBuilderResult } from "../definitions/lessons";
import { getCourseForBuilder } from "../data/courses";
import { logActivity } from "./activity-log";

export async function enrollInCourse(courseId: number): Promise<{
  success: boolean;
  message: string;
  unlockedAchievements?: UnlockedAchievement[];
}> {
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

    const { unlocked } = await evaluateAchievements(userId);

    // Get course name for log
    const courseInfo = await db.select({ name: courses.name }).from(courses).where(eq(courses.id, courseId)).limit(1);
    void logActivity({
      userId,
      action: 'ENROLL_COURSE',
      entityType: 'course',
      entityId: courseId,
      entityName: courseInfo[0]?.name ?? undefined,
    });

    return { success: true, message: 'Successfully enrolled', unlockedAchievements: unlocked };

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

export async function rateCourse(courseId: number, rating: number): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: 'You must be logged in to rate' };
    }
    const userId = session.user.id;

    // 1. Update review in enrollments
    await db.update(enrollments)
      .set({ user_rating: rating })
      .where(and(eq(enrollments.user_id, userId), eq(enrollments.course_id, courseId)));

    // 2. Calculate new average rating and update course
    const allReviews = await db
      .select({ rating: enrollments.user_rating })
      .from(enrollments)
      .where(and(
        eq(enrollments.course_id, courseId),
        isNotNull(enrollments.user_rating)
      ));

    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating!, 0);
      const avgRating = (totalRating / allReviews.length).toFixed(1);

      await db.update(courses)
        .set({
          rating: avgRating.toString(),
          reviews_count: allReviews.length
        })
        .where(eq(courses.id, courseId));
    }

    const courseInfo = await db.select({ name: courses.name }).from(courses).where(eq(courses.id, courseId)).limit(1);
    void logActivity({
      userId,
      action: 'RATE_COURSE',
      entityType: 'course',
      entityId: courseId,
      entityName: courseInfo[0]?.name ?? undefined,
    });

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { success: true, message: 'Rating submitted successfully' };
  } catch (error) {
    console.error('Error rating course:', error);
    return { success: false, message: 'Failed to submit rating' };
  }
}

// ---------------------------------------------------------------------------
// Private helper — shared upsert logic (not exported, not a server action)
// ---------------------------------------------------------------------------
async function _persistCourseData(
  courseData: CourseBuilderResult,
): Promise<{ courseId: number; isNewCourse: boolean }> {
  let targetCourseId = courseData.id;
  let isNewCourse = true;

  // --- Upsert Category ---
  let resolvedCategoryId: number | null = null;
  const trimmedCategoryName = courseData.category_name?.trim();

  if (trimmedCategoryName) {
    const existingCategory = await db
      .select({ id: categories.id })
      .from(categories)
      .where(ilike(categories.name, trimmedCategoryName))
      .limit(1);

    if (existingCategory.length > 0) {
      resolvedCategoryId = existingCategory[0].id;
    } else {
      const baseSlug = trimmedCategoryName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const uniqueSlug = `${baseSlug}-${Date.now()}`;

      const [newCategory] = await db
        .insert(categories)
        .values({ name: trimmedCategoryName, slug: uniqueSlug })
        .returning({ id: categories.id });
      resolvedCategoryId = newCategory.id;
    }
  }

  await db.transaction(async (tx) => {
    // 1. Determine if course already exists in DB
    if (targetCourseId > 0) {
      const existing = await tx
        .select({ id: courses.id })
        .from(courses)
        .where(eq(courses.id, targetCourseId))
        .limit(1);
      if (existing.length > 0) isNewCourse = false;
    }

    // 2. Upsert course row (always as draft — publish status is set separately)
    if (isNewCourse) {
      const [insertedCourse] = await tx
        .insert(courses)
        .values({
          category_id: resolvedCategoryId,
          name: courseData.name,
          description: courseData.description,
          level: courseData.level,
          icon_name: courseData.icon,
          theme_color: courseData.theme_color,
          status: 'draft',
        })
        .returning({ id: courses.id });
      targetCourseId = insertedCourse.id;
    } else {
      await tx
        .update(courses)
        .set({
          category_id: resolvedCategoryId,
          name: courseData.name,
          description: courseData.description,
          level: courseData.level,
          icon_name: courseData.icon,
          theme_color: courseData.theme_color,
          updated_at: new Date(),
        })
        .where(eq(courses.id, targetCourseId));
    }

    // 3. Delete removed sections / lessons (skip for brand-new courses)
    if (!isNewCourse) {
      const dbSections = await tx
        .select({ id: sections.id })
        .from(sections)
        .where(eq(sections.course_id, targetCourseId));

      const submittedSectionIds = courseData.sections.map((s) => s.id).filter((id) => id > 0);
      const sectionsToDelete = dbSections.map((s) => s.id).filter((id) => !submittedSectionIds.includes(id));

      if (sectionsToDelete.length > 0) {
        await tx.delete(sections).where(
          and(eq(sections.course_id, targetCourseId), inArray(sections.id, sectionsToDelete))
        );
      }

      const submittedLessonIds: number[] = [];
      const submittedSectionPositiveIds: number[] = [];
      for (const section of courseData.sections) {
        if (section.id > 0) {
          submittedSectionPositiveIds.push(section.id);
          for (const lesson of section.lessons) {
            if (lesson.id > 0) submittedLessonIds.push(lesson.id);
          }
        }
      }

      if (submittedSectionPositiveIds.length > 0) {
        const dbLessons = await tx
          .select({ id: lessons.id })
          .from(lessons)
          .where(inArray(lessons.section_id, submittedSectionPositiveIds));

        const lessonsToDelete = dbLessons.map((l) => l.id).filter((id) => !submittedLessonIds.includes(id));
        if (lessonsToDelete.length > 0) {
          await tx.delete(lessons).where(inArray(lessons.id, lessonsToDelete));
        }
      }
    }

    // 4. Upsert sections and lessons
    for (let secIdx = 0; secIdx < courseData.sections.length; secIdx++) {
      const section = courseData.sections[secIdx];
      let currentSectionId = section.id;
      const isNewSection = isNewCourse || section.id < 0;

      if (isNewSection) {
        const [insertedSec] = await tx
          .insert(sections)
          .values({ course_id: targetCourseId, title: section.title, order_index: secIdx })
          .returning({ id: sections.id });
        currentSectionId = insertedSec.id;
      } else {
        await tx
          .update(sections)
          .set({ title: section.title, order_index: secIdx, updated_at: new Date() })
          .where(and(eq(sections.id, currentSectionId), eq(sections.course_id, targetCourseId)));
      }

      for (let lesIdx = 0; lesIdx < section.lessons.length; lesIdx++) {
        const lesson = section.lessons[lesIdx];
        const isNewLesson = isNewSection || lesson.id < 0;

        if (isNewLesson) {
          await tx.insert(lessons).values({
            section_id: currentSectionId,
            title: lesson.title,
            duration_minutes: lesson.duration,
            xp_reward: lesson.xp,
            order_index: lesIdx,
          });
        } else {
          // Only update order_index; title/duration/xp are owned by Lesson Builder
          await tx.update(lessons).set({ order_index: lesIdx }).where(eq(lessons.id, lesson.id));
        }
      }
    }
  });

  return { courseId: targetCourseId, isNewCourse };
}

// ---------------------------------------------------------------------------
// Public server action 1: Save course as draft
// ---------------------------------------------------------------------------
export async function saveCourseBuilder(
  courseData: CourseBuilderResult,
): Promise<{ success: boolean; course?: CourseBuilderResult; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'You must be logged in' };

    const { courseId, isNewCourse } = await _persistCourseData(courseData);

    const refreshedCourse = await getCourseForBuilder(courseId.toString());
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath(`/admin/courses`);
    revalidatePath(`/dashboard/courses`);

    if (!refreshedCourse) return { success: false, error: 'Saved but failed to load refreshed course data.' };

    void logActivity({
      userId: session.user.id,
      action: isNewCourse ? 'CREATE_COURSE' : 'UPDATE_COURSE',
      entityType: 'course',
      entityId: courseId,
      entityName: courseData.name,
      metadata: { published: false },
    });

    return { success: true, course: refreshedCourse };
  } catch (error) {
    console.error('Error saving course builder:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown database error occurred' };
  }
}

// ---------------------------------------------------------------------------
// Public server action 2: Save + validate + publish course
// ---------------------------------------------------------------------------
export async function publishCourseBuilder(
  courseData: CourseBuilderResult,
): Promise<{ success: boolean; course?: CourseBuilderResult; error?: string; publishError?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'You must be logged in' };

    const { courseId, isNewCourse } = await _persistCourseData(courseData);

    // --- Server-side publish validation (runs after data is committed) ---
    const sectionRows = await db.select({ id: sections.id }).from(sections).where(eq(sections.course_id, courseId));
    const sectionIdList = sectionRows.map((s) => s.id);

    const lessonRows = sectionIdList.length > 0
      ? await db.select({ id: lessons.id }).from(lessons).where(inArray(lessons.section_id, sectionIdList))
      : [];
    const lessonIdList = lessonRows.map((l) => l.id);

    let publishError: string | undefined;

    if (lessonRows.length < 3) {
      publishError = `Course must have at least 3 lessons to publish (currently has ${lessonRows.length}).`;
    } else {
      const quizRows = await db
        .select({ id: quizzes.id })
        .from(quizzes)
        .where(inArray(quizzes.lesson_id, lessonIdList))
        .limit(1);

      if (quizRows.length === 0) {
        publishError = 'Course must have at least 1 quiz to publish.';
      }
    }

    if (!publishError) {
      // Validation passed: publish course + all its lessons
      await db.update(courses).set({ status: 'published' }).where(eq(courses.id, courseId));
      if (lessonIdList.length > 0) {
        await db.update(lessons).set({ status: 'published' }).where(inArray(lessons.id, lessonIdList));
      }
    }

    const refreshedCourse = await getCourseForBuilder(courseId.toString());
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath(`/admin/courses`);
    revalidatePath(`/dashboard/courses`);

    if (!refreshedCourse) return { success: false, error: 'Saved but failed to load refreshed course data.' };

    void logActivity({
      userId: session.user.id,
      action: isNewCourse ? 'CREATE_COURSE' : 'UPDATE_COURSE',
      entityType: 'course',
      entityId: courseId,
      entityName: courseData.name,
      metadata: { published: !publishError },
    });

    return { success: true, course: refreshedCourse, publishError };
  } catch (error) {
    console.error('Error publishing course builder:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown database error occurred' };
  }
}

export async function UnPublishCourse(courseId: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" };
    }

    await db.update(courses).set({ status: 'draft' }).where(eq(courses.id, courseId));

    void logActivity({
      userId: session.user.id,
      action: 'UNPUBLISH_COURSE',
      entityType: 'course',
      entityId: courseId,
    });

    const refreshedCourse = await getCourseForBuilder(courseId.toString());
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath(`/admin/courses`);
    revalidatePath(`/dashboard/courses`);

    if (!refreshedCourse) return { success: false, error: 'Unpublished but failed to load refreshed course data.' };

    return { success: true, course: refreshedCourse };
  } catch (error) {
    console.error('Error unpublishing course:', error);
    return { success: false, error: 'Failed to unpublish course' };
  }
}

export async function DeleteCourse(courseId: number) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be logged in" };
    }

    await db.delete(courses).where(eq(courses.id, courseId));

    void logActivity({
      userId: session.user.id,
      action: 'DELETE_COURSE',
      entityType: 'course',
      entityId: courseId,
    });

    revalidatePath(`/admin/courses`);
    revalidatePath(`/dashboard/courses`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting course:', error);
    return { success: false, error: 'Failed to delete course' };
  }
}
