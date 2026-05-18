import { db } from "../db";
import * as schema from "../db/schema";
import { eq, sql, desc, notInArray, getTableColumns, and } from "drizzle-orm";
import { CourseListing, CourseDetail } from "../definitions/courses";

// 1. Định nghĩa các Subqueries để đếm (Dùng chung cho toàn bộ file)
const lessonStats = db
  .select({
    courseId: schema.sections.course_id,
    total: sql<number>`cast(count(${schema.lessons.id}) as int)`.as('l_count'),
    total_xp: sql<number>`cast(sum(coalesce(${schema.lessons.xp_reward}, 0)) as int)`.as('total_xp'),
    total_duration: sql<number>`cast(sum(coalesce(${schema.lessons.duration_minutes}, 0)) as int)`.as('total_duration'),
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

    return data as any as CourseListing[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all courses [DRIZZLE_FIX].');
  }
}

export async function getEnrolledCourses(userId: string) {
  try {
    const data = await db
      .select({
        ...getTableColumns(schema.courses),
        category_name: schema.categories.name,
        progress_percent: schema.enrollments.progress_percent,
        current_lesson: sql<string>`(
          SELECT l.title
          FROM lessons l
          JOIN sections s ON l.section_id = s.id
          LEFT JOIN user_lesson_progress ulp 
            ON ulp.lesson_id = l.id 
            AND ulp.user_id = ${userId} 
            AND ulp.status = 'completed'
          WHERE s.course_id = courses.id AND ulp.lesson_id IS NULL
          ORDER BY s.order_index ASC, l.order_index ASC
          LIMIT 1
        )`,
      })
      .from(schema.courses)
      .innerJoin(schema.enrollments, eq(schema.courses.id, schema.enrollments.course_id))
      .leftJoin(schema.categories, eq(schema.courses.category_id, schema.categories.id))
      .where(eq(schema.enrollments.user_id, userId))
      .orderBy(desc(schema.enrollments.last_accessed_at));

    return data as any as CourseListing[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user enrolled courses.');
  }
}

export async function getNotEnrolledCourses(userId: string) {
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
      .where(notInArray(schema.courses.id, userEnrollments))
      .orderBy(desc(enrolledCount));

    return data as any as CourseListing[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user not enrolled courses.');
  }
}

export async function getCourseById(id: string, userId?: string): Promise<CourseDetail | null> {
  try {
    const courseId = Number(id);

    // 1. Lấy thông tin cơ bản + số liệu tổng của khóa học
    const courseData = await db
      .select({
        ...getTableColumns(schema.courses),
        total_lessons: sql<number>`coalesce(${lessonStats.total}, 0)`,
        enrolled_count: sql<number>`coalesce(${enrollmentStats.total}, 0)`,
        progress_percent: sql<number>`0`,
        total_xp: sql<number>`coalesce(${lessonStats.total_xp}, 0)`,
        total_duration: sql<number>`coalesce(${lessonStats.total_duration}, 0)`,
        category_name: schema.categories.name,
      })
      .from(schema.courses)
      .leftJoin(schema.categories, eq(schema.courses.category_id, schema.categories.id))
      .leftJoin(lessonStats, eq(schema.courses.id, lessonStats.courseId))
      .leftJoin(enrollmentStats, eq(schema.courses.id, enrollmentStats.courseId))
      .where(eq(schema.courses.id, courseId))
      .limit(1);

    if (courseData.length === 0) return null;

    const course = courseData[0] as any as CourseDetail;

    // Thiết lập giá trị mặc định cho các trường tiến độ
    course.is_enrolled = false;
    course.completed_lessons = 0;
    course.xp_earned = 0;
    course.learned_minutes = 0;

    if (userId) {
      // 2. Kiểm tra trạng thái đăng ký
      const enrollment = await db
        .select()
        .from(schema.enrollments)
        .where(
          and(
            eq(schema.enrollments.course_id, courseId),
            eq(schema.enrollments.user_id, userId)
          )
        )
        .limit(1);

      if (enrollment.length > 0) {
        course.is_enrolled = true;
        course.progress_percent = enrollment[0].progress_percent || 0;

        // 3. Lấy tiến độ học tập thực tế
        const progress = await db
          .select({
            completed_count: sql<number>`cast(count(${schema.user_lesson_progress.lesson_id}) as int)`,
            xp_sum: sql<number>`cast(sum(coalesce(${schema.lessons.xp_reward}, 0)) as int)`,
            duration_sum: sql<number>`cast(sum(coalesce(${schema.lessons.duration_minutes}, 0)) as int)`,
          })
          .from(schema.user_lesson_progress)
          .innerJoin(schema.lessons, eq(schema.user_lesson_progress.lesson_id, schema.lessons.id))
          .innerJoin(schema.sections, eq(schema.lessons.section_id, schema.sections.id))
          .where(
            and(
              eq(schema.user_lesson_progress.user_id, userId),
              eq(schema.sections.course_id, courseId),
              eq(schema.user_lesson_progress.status, 'completed')
            )
          );

        if (progress.length > 0) {
          course.completed_lessons = progress[0].completed_count || 0;
          course.xp_earned = progress[0].xp_sum || 0;
          course.learned_minutes = progress[0].duration_sum || 0;
        }
      }
    }

    return course;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch course by ID.');
  }
}

export async function getUserCourseRating(courseId: number, userId: string): Promise<number | null> {
  try {
    const enrollment = await db
      .select({ rating: schema.enrollments.user_rating })
      .from(schema.enrollments)
      .where(
        and(
          eq(schema.enrollments.course_id, courseId),
          eq(schema.enrollments.user_id, userId)
        )
      )
      .limit(1);

    return enrollment.length > 0 ? enrollment[0].rating : null;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}
