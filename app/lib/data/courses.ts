import { db } from "../db";
import * as schema from "../db/schema";
import { eq, sql, desc, notInArray, getTableColumns } from "drizzle-orm";
import { Courses } from "../definitions/courses";

// 1. Định nghĩa các Subqueries để đếm (Dùng chung cho toàn bộ file)
const lessonStats = db
  .select({
    courseId: schema.sections.course_id,
    total: sql<number>`cast(count(${schema.lessons.id}) as int)`.as('l_count'),
  })
  .from(schema.sections)
  .leftJoin(schema.lessons, eq(schema.sections.id, schema.lessons.section_id))
  .groupBy(schema.sections.course_id)
  .as('ls');

const enrollmentStats = db
  .select({
    courseId: schema.enrollments.course_id,
    total: sql<number>`cast(count(${schema.enrollments.user_id}) as int)`.as('e_count'),
  })
  .from(schema.enrollments)
  .groupBy(schema.enrollments.course_id)
  .as('es');

export async function fetchAllCourses() {
  try {
    const totalLessons = sql<number>`coalesce(${lessonStats.total}, 0)`.as('total_lessons');
    const enrolledCount = sql<number>`coalesce(${enrollmentStats.total}, 0)`.as('enrolled_count');

    const data = await db
      .select({
        ...getTableColumns(schema.courses),
        category_name: schema.categories.name,
        total_lessons: totalLessons,
        enrolled_count: enrolledCount,
      })
      .from(schema.courses)
      .leftJoin(schema.categories, eq(schema.courses.category_id, schema.categories.id))
      .leftJoin(lessonStats, eq(schema.courses.id, lessonStats.courseId))
      .leftJoin(enrollmentStats, eq(schema.courses.id, enrollmentStats.courseId))
      .orderBy(desc(enrolledCount));

    return data as any as Courses[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all courses [DRIZZLE_FIX].');
  }
}

export async function fetchPopularCourses() {
  try {
    const totalLessons = sql<number>`coalesce(${lessonStats.total}, 0)`.as('total_lessons');
    const enrolledCount = sql<number>`coalesce(${enrollmentStats.total}, 0)`.as('enrolled_count');

    const data = await db
      .select({
        ...getTableColumns(schema.courses),
        category_name: schema.categories.name,
        total_lessons: totalLessons,
        enrolled_count: enrolledCount,
      })
      .from(schema.courses)
      .leftJoin(schema.categories, eq(schema.courses.category_id, schema.categories.id))
      .leftJoin(lessonStats, eq(schema.courses.id, lessonStats.courseId))
      .leftJoin(enrollmentStats, eq(schema.courses.id, enrollmentStats.courseId))
      .orderBy(desc(enrolledCount))
      .limit(3);

    return data as any as Courses[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch popular courses [DRIZZLE_FIX].');
  }
}

export async function fetchUserEnrolledCourses(userId: string) {
  try {
    const data = await db
      .select({
        ...getTableColumns(schema.courses),
        category_name: schema.categories.name,
        progress_percent: schema.enrollments.progress_percent,
      })
      .from(schema.courses)
      .innerJoin(schema.enrollments, eq(schema.courses.id, schema.enrollments.course_id))
      .leftJoin(schema.categories, eq(schema.courses.category_id, schema.categories.id))
      .where(eq(schema.enrollments.user_id, userId));

    return data as any as Courses[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user enrolled courses.');
  }
}

export async function fetchUserNotEnrolledCourses(userId: string) {
  try {
    const userEnrollments = db
      .select({ course_id: schema.enrollments.course_id })
      .from(schema.enrollments)
      .where(eq(schema.enrollments.user_id, userId));

    const totalLessons = sql<number>`coalesce(${lessonStats.total}, 0)`.as('total_lessons');
    const enrolledCount = sql<number>`coalesce(${enrollmentStats.total}, 0)`.as('enrolled_count');

    const data = await db
      .select({
        ...getTableColumns(schema.courses),
        category_name: schema.categories.name,
        total_lessons: totalLessons,
        enrolled_count: enrolledCount,
      })
      .from(schema.courses)
      .leftJoin(schema.categories, eq(schema.courses.category_id, schema.categories.id))
      .leftJoin(lessonStats, eq(schema.courses.id, lessonStats.courseId))
      .leftJoin(enrollmentStats, eq(schema.courses.id, enrollmentStats.courseId))
      .where(notInArray(schema.courses.id, userEnrollments));

    return data as any as Courses[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user not enrolled courses.');
  }
}