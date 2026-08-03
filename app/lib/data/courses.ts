import { db } from "../db";
import * as schema from "../db/schema";
import { eq, sql, desc, notInArray, getTableColumns, and, inArray, gt, isNotNull } from "drizzle-orm";
import { CourseListing, CourseDetail, Category } from "../definitions/courses";
import { CourseBuilderResult, CourseBuilderSection } from "../definitions/lessons";

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
  .where(eq(schema.lessons.status, 'published'))
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


export async function getTopCategory() {
  try {
    const data = await db.execute<{ id: number; name: string; total_courses: number }>(sql`
      SELECT 
        ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC)::int AS id,
        TRIM(cat) AS name,
        COUNT(*)::int AS total_courses
      FROM ${schema.courses},
      UNNEST(${schema.courses.categories}) AS cat
      WHERE ${schema.courses.status} = 'published'
        AND TRIM(cat) <> ''
      GROUP BY TRIM(cat)
      ORDER BY total_courses DESC
      LIMIT 5
    `);
    const rows = Array.isArray(data) ? data : ((data as any).rows || []);
    return rows as any as Category[];
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}


export async function fetchAllCourses(options?: { status?: 'published' | 'draft' }) {
  try {
    const totalLessons = sql<number>`coalesce(${lessonStats.total}, 0)`.as('total_lessons');
    const enrolledCount = sql<number>`coalesce(${enrollmentStats.total}, 0)`.as('enrolled_count');

    const query = db
      .select({
        ...getTableColumns(schema.courses),
        category_name: sql<string>`array_to_string(${schema.courses.categories}, ', ')`,
        total_lessons: totalLessons,
        total_duration: sql<number>`coalesce(${lessonStats.total_duration}, 0)`,
        enrolled_count: enrolledCount,
      })
      .from(schema.courses)
      .leftJoin(lessonStats, eq(schema.courses.id, lessonStats.courseId))
      .leftJoin(enrollmentStats, eq(schema.courses.id, enrollmentStats.courseId));

    if (options?.status) {
      query.where(eq(schema.courses.status, options.status));
    }

    query.orderBy(desc(enrolledCount));

    const data = await query;
    return data as any as CourseListing[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch courses.');
  }
}

export async function getEnrolledCourses(userId: string) {
  try {
    const data = await db
      .select({
        ...getTableColumns(schema.courses),
        category_name: sql<string>`array_to_string(${schema.courses.categories}, ', ')`,
        progress_percent: sql<number>`
          CASE
            WHEN (
              SELECT COUNT(*) FROM lessons l
              JOIN sections s ON l.section_id = s.id
              WHERE s.course_id = courses.id AND l.status = 'published'
            ) = 0 THEN 0
            ELSE ROUND(
              CAST((
                SELECT COUNT(*) FROM user_lesson_progress ulp
                JOIN lessons l ON ulp.lesson_id = l.id
                JOIN sections s ON l.section_id = s.id
                WHERE s.course_id = courses.id
                  AND l.status = 'published'
                  AND ulp.user_id = ${userId}
                  AND ulp.status = 'completed'
              ) AS REAL) * 100.0 /
              (
                SELECT COUNT(*) FROM lessons l
                JOIN sections s ON l.section_id = s.id
                WHERE s.course_id = courses.id AND l.status = 'published'
              )
            )
          END
        `,
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
      .where(and(
        eq(schema.enrollments.user_id, userId),
        eq(schema.courses.status, 'published')
      ))
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
        category_name: sql<string>`array_to_string(${schema.courses.categories}, ', ')`,
        total_lessons: totalLessons,
        enrolled_count: enrolledCount,
      })
      .from(schema.courses)
      .leftJoin(lessonStats, eq(schema.courses.id, lessonStats.courseId))
      .leftJoin(enrollmentStats, eq(schema.courses.id, enrollmentStats.courseId))
      .where(and(
        notInArray(schema.courses.id, userEnrollments),
        eq(schema.courses.status, 'published')
      ))
      .orderBy(desc(enrolledCount));

    return data as any as CourseListing[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user not enrolled courses.');
  }
}

export async function getCourseById(courseId: number, userId?: string): Promise<CourseDetail | null> {
  try {
    const courseData = await db
      .select({
        ...getTableColumns(schema.courses),
        total_lessons: sql<number>`coalesce(${lessonStats.total}, 0)`,
        enrolled_count: sql<number>`coalesce(${enrollmentStats.total}, 0)`,
        progress_percent: sql<number>`0`,
        total_xp: sql<number>`coalesce(${lessonStats.total_xp}, 0)`,
        total_duration: sql<number>`coalesce(${lessonStats.total_duration}, 0)`,
        category_name: sql<string>`array_to_string(${schema.courses.categories}, ', ')`,
      })
      .from(schema.courses)
      .leftJoin(lessonStats, eq(schema.courses.id, lessonStats.courseId))
      .leftJoin(enrollmentStats, eq(schema.courses.id, enrollmentStats.courseId))
      .where(eq(schema.courses.id, courseId))
      .limit(1);

    if (courseData.length === 0) return null;

    const course = courseData[0] as any as CourseDetail;

    course.is_enrolled = false;
    course.completed_lessons = 0;
    course.xp_earned = 0;
    course.learned_minutes = 0;

    if (userId) {
      const enrollment = await db
        .select({ id: schema.enrollments.user_id })
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

        // Tính động: completed published lessons / total published lessons
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
              eq(schema.lessons.status, 'published'),
              eq(schema.user_lesson_progress.status, 'completed')
            )
          );

        const totalPublished = await db
          .select({ cnt: sql<number>`cast(count(${schema.lessons.id}) as int)` })
          .from(schema.lessons)
          .innerJoin(schema.sections, eq(schema.lessons.section_id, schema.sections.id))
          .where(
            and(
              eq(schema.sections.course_id, courseId),
              eq(schema.lessons.status, 'published')
            )
          );

        const completedCount = progress[0]?.completed_count || 0;
        const totalCount = totalPublished[0]?.cnt || 0;
        course.progress_percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        if (progress.length > 0) {
          course.completed_lessons = completedCount;
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

export async function getCourseStatus(courseId: number): Promise<string | null> {
  const result = await db
    .select({ status: schema.courses.status })
    .from(schema.courses)
    .where(eq(schema.courses.id, courseId))
    .limit(1);
  return result.length > 0 ? result[0].status : null;
}

export async function getCourseForBuilder(id: string): Promise<CourseBuilderResult | null> {
  try {
    const courseId = Number(id);

    // 1. Lấy thông tin cơ bản của course + category
    const courseRows = await db
      .select({
        id: schema.courses.id,
        name: schema.courses.name,
        description: schema.courses.description,
        category_name: sql<string>`array_to_string(${schema.courses.categories}, ', ')`,
        level: schema.courses.level,
        icon: schema.courses.icon_name,
        theme_color: schema.courses.theme_color,
        status: schema.courses.status,
      })
      .from(schema.courses)
      .where(eq(schema.courses.id, courseId))
      .limit(1);

    if (courseRows.length === 0) return null;

    // 2. Lấy danh sách sections theo thứ tự
    const sectionRows = await db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.course_id, courseId))
      .orderBy(schema.sections.order_index);

    // 3. Lấy tất cả lessons thuộc các sections trên
    let lessonRows: {
      id: number; section_id: number | null; title: string;
      duration_minutes: number | null; xp_reward: number | null;
      status: string | null;
    }[] = [];

    const sectionIds = sectionRows.map(s => s.id);

    if (sectionIds.length > 0) {
      lessonRows = await db
        .select({
          id: schema.lessons.id,
          section_id: schema.lessons.section_id,
          title: schema.lessons.title,
          duration_minutes: schema.lessons.duration_minutes,
          xp_reward: schema.lessons.xp_reward,
          status: schema.lessons.status,
        })
        .from(schema.lessons)
        .where(inArray(schema.lessons.section_id, sectionIds))
        .orderBy(schema.lessons.section_id, schema.lessons.order_index);
    }

    // 4. Ghép lessons vào từng section
    const sections: CourseBuilderSection[] = sectionRows.map(section => ({
      id: section.id,
      title: section.title,
      lessons: lessonRows
        .filter(l => l.section_id === section.id)
        .map(l => ({
          id: l.id,
          title: l.title,
          duration: l.duration_minutes || 0,
          xp: l.xp_reward || 0,
          status: l.status || 'draft',
        })),
    }));

    return { ...courseRows[0], sections };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch course for builder.');
  }
}

// ─── Recommendation System ─────────────────────────────────────────────────────

/**
 * Tổng hợp tất cả tags/categories mà user đã quan tâm:
 * - Từ các khoá học đã enroll (courses.categories)
 * - Từ các flashcard sets đã access (flashcard_sets.tags)
 * Trả về mảng unique tags đã được de-dup.
 */
export async function getUserInterestTags(userId: string): Promise<string[]> {
  try {
    const [courseTagsRow, flashcardTagsRow] = await Promise.all([
      // Tags từ enrolled courses
      db.execute<{ tags: string[] }>(sql`
        SELECT ARRAY_AGG(DISTINCT TRIM(cat)) FILTER (WHERE TRIM(cat) <> '') AS tags
        FROM ${schema.enrollments}
        JOIN ${schema.courses} ON ${schema.enrollments.course_id} = ${schema.courses.id}
        , UNNEST(${schema.courses.categories}) AS cat
        WHERE ${schema.enrollments.user_id} = ${userId}
      `),
      // Tags từ accessed flashcard sets
      db.execute<{ tags: string[] }>(sql`
        SELECT ARRAY_AGG(DISTINCT TRIM(tag)) FILTER (WHERE TRIM(tag) <> '') AS tags
        FROM ${schema.flashcard_access_log}
        JOIN ${schema.flashcard_sets} ON ${schema.flashcard_access_log.set_id} = ${schema.flashcard_sets.id}
        , UNNEST(${schema.flashcard_sets.tags}) AS tag
        WHERE ${schema.flashcard_access_log.user_id} = ${userId}
      `),
    ]);

    const toArr = (rows: any) => {
      const r = Array.isArray(rows) ? rows[0] : (rows as any).rows?.[0];
      return (r?.tags as string[] | null) ?? [];
    };

    const merged = [...toArr(courseTagsRow), ...toArr(flashcardTagsRow)];
    // De-dup case-insensitive
    const seen = new Set<string>();
    return merged.filter((t) => {
      const key = t.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch (error) {
    console.error('getUserInterestTags error:', error);
    return [];
  }
}

/**
 * Gợi ý các khoá học phù hợp với sở thích của user.
 * - Nếu user có interestTags: ưu tiên khoá học có tags trùng nhiều nhất (overlap score).
 * - Fallback: sort theo enrolled_count cao nhất (khoá học phổ biến).
 */
export async function getRecommendedCourses(
  userId: string,
  interestTags: string[],
  limit = 6,
): Promise<CourseListing[]> {
  try {
    if (interestTags.length === 0) {
      // Fallback: top popular courses not yet enrolled
      const userEnrollments = db
        .select({ course_id: schema.enrollments.course_id })
        .from(schema.enrollments)
        .where(eq(schema.enrollments.user_id, userId));

      const enrolledCount = sql<number>`coalesce(${enrollmentStats.total}, 0)`.as('enrolled_count');
      const totalLessons = sql<number>`coalesce(${lessonStats.total}, 0)`.as('total_lessons');

      const data = await db
        .select({
          ...getTableColumns(schema.courses),
          category_name: sql<string>`array_to_string(${schema.courses.categories}, ', ')`,
          total_lessons: totalLessons,
          total_duration: sql<number>`coalesce(${lessonStats.total_duration}, 0)`,
          enrolled_count: enrolledCount,
        })
        .from(schema.courses)
        .leftJoin(lessonStats, eq(schema.courses.id, lessonStats.courseId))
        .leftJoin(enrollmentStats, eq(schema.courses.id, enrollmentStats.courseId))
        .where(and(
          notInArray(schema.courses.id, userEnrollments),
          eq(schema.courses.status, 'published'),
        ))
        .orderBy(desc(enrolledCount))
        .limit(limit);

      return data as any as CourseListing[];
    }

    // Tag-based: score = số tags trùng với interestTags
    const userEnrollments = db
      .select({ course_id: schema.enrollments.course_id })
      .from(schema.enrollments)
      .where(eq(schema.enrollments.user_id, userId));

    const enrolledCount = sql<number>`coalesce(${enrollmentStats.total}, 0)`.as('enrolled_count');
    const totalLessons = sql<number>`coalesce(${lessonStats.total}, 0)`.as('total_lessons');
    const tagsParam = `{${interestTags.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(',')}}`;

    const data = await db
      .select({
        ...getTableColumns(schema.courses),
        category_name: sql<string>`array_to_string(${schema.courses.categories}, ', ')`,
        total_lessons: totalLessons,
        total_duration: sql<number>`coalesce(${lessonStats.total_duration}, 0)`,
        enrolled_count: enrolledCount,
        recommendation_score: sql<number>`
          CARDINALITY(
            ARRAY(
              SELECT UNNEST(${schema.courses.categories})
              INTERSECT
              SELECT UNNEST(${sql.raw(`'${tagsParam}'::text[]`)})
            )
          )
        `.as('recommendation_score'),
      })
      .from(schema.courses)
      .leftJoin(lessonStats, eq(schema.courses.id, lessonStats.courseId))
      .leftJoin(enrollmentStats, eq(schema.courses.id, enrollmentStats.courseId))
      .where(and(
        notInArray(schema.courses.id, userEnrollments),
        eq(schema.courses.status, 'published'),
        sql`${schema.courses.categories} && ${sql.raw(`'${tagsParam}'::text[]`)}`,
      ))
      .orderBy(
        desc(sql`recommendation_score`),
        desc(enrolledCount),
      )
      .limit(limit);

    return data as any as CourseListing[];
  } catch (error) {
    console.error('getRecommendedCourses error:', error);
    return [];
  }
}

