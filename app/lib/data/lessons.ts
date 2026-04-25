import { db } from "../db";
import * as schema from "../db/schema";
import { eq, sql, getTableColumns, and } from "drizzle-orm";
import { CourseCurriculum, DetailLesson } from "../definitions/lessons";

// export async function getSectionsByCourseId(id: number) {
//   try {
//     const data = await db
//       .select()
//       .from(schema.sections)
//       .where(eq(schema.sections.course_id, id))
//       .orderBy(schema.sections.order_index);
//     return data;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch sections.');
//   }
// }

// export async function getLessonBySectionId(id: number) {
//   try {
//     const data = await db
//       .select()
//       .from(schema.lessons)
//       .where(eq(schema.lessons.section_id, id))
//       .orderBy(schema.lessons.order_index);
//     return data;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch lessons.');
//   }
// }

export async function getCourseCurriculum(courseId: number, userId?: string): Promise<CourseCurriculum> {
  try {
    // 1. Lấy tất cả các section của course
    const allSections = await db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.course_id, courseId))
      .orderBy(schema.sections.order_index);

    // 2. Lấy tất cả bài học thuộc course này thông qua join với sections
    const allLessons = await db
      .select({
        id: schema.lessons.id,
        section_id: schema.lessons.section_id,
        title: schema.lessons.title,
        duration: schema.lessons.duration_minutes,
        xp: schema.lessons.xp_reward,
        order_index: schema.lessons.order_index,
      })
      .from(schema.lessons)
      .innerJoin(schema.sections, eq(schema.lessons.section_id, schema.sections.id))
      .where(eq(schema.sections.course_id, courseId))
      .orderBy(schema.lessons.order_index);

    // 3. Lấy tiến độ của user nếu có userId
    const userProgressMap = new Map<number, string>();
    if (userId) {
      const progressData = await db
        .select()
        .from(schema.user_lesson_progress)
        .where(eq(schema.user_lesson_progress.user_id, userId));

      progressData.forEach(p => {
        userProgressMap.set(p.lesson_id, p.status || 'LOCKED');
      });
    }

    // 4. Nhóm bài học vào các section theo định dạng Curriculum
    const curriculum: CourseCurriculum = allSections.map((section) => {
      const sectionLessons = allLessons
        .filter((lesson) => lesson.section_id === section.id)
        .map((lesson) => {
          const status = userProgressMap.get(lesson.id);
          return {
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration || 0,
            xp: lesson.xp || 0,
            completed: status === 'COMPLETED',
            locked: status === 'LOCKED' || !status,
            isCurrent: status === 'UNLOCKED' || status === 'IN_PROGRESS',
          };
        });

      return {
        section: section.title,
        lessons: sectionLessons,
      };
    });

    return curriculum;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch course curriculum.');
  }
}

export async function getLessonDetail(lessonId: number, userId?: string): Promise<DetailLesson | null> {
  try {
    const lessonData = await db
      .select({
        id: schema.lessons.id,
        title: schema.lessons.title,
        content: schema.lessons.content,
        video_url: schema.lessons.video_url,
        lesson_type: schema.lessons.lesson_type,
        xp_reward: schema.lessons.xp_reward,
        duration_minutes: schema.lessons.duration_minutes,
        course_id: schema.sections.course_id,
        courseTitle: schema.courses.name,
      })
      .from(schema.lessons)
      .innerJoin(schema.sections, eq(schema.lessons.section_id, schema.sections.id))
      .innerJoin(schema.courses, eq(schema.sections.course_id, schema.courses.id))
      .where(eq(schema.lessons.id, lessonId))
      .limit(1);

    if (lessonData.length === 0) return null;

    const lesson = lessonData[0];

    if (!lesson.course_id) {
      throw new Error('Lesson is not associated with a course.');
    }

    // 2. Lấy danh sách ID bài học trong khóa học này để tính số thứ tự (Lesson Number)
    const lessonsInCourse = await db
      .select({ id: schema.lessons.id })
      .from(schema.lessons)
      .innerJoin(schema.sections, eq(schema.lessons.section_id, schema.sections.id))
      .where(eq(schema.sections.course_id, lesson.course_id))
      .orderBy(schema.sections.order_index, schema.lessons.order_index);

    const lessonNumber = lessonsInCourse.findIndex(l => l.id === lessonId) + 1;
    const totalLessons = lessonsInCourse.length;

    // Trả về object đã map sẵn sàng cho UI và khớp với interface DetailLesson
    return {
      id: lesson.id,
      title: lesson.title,
      content: lesson.content || null,
      video_url: lesson.video_url || null,
      lesson_type: lesson.lesson_type || 'doc',
      xp_reward: lesson.xp_reward || 0,
      duration_minutes: lesson.duration_minutes || 0,
      course_id: lesson.course_id,
      courseTitle: lesson.courseTitle || 'Unknown Course',
      lessonNumber,
      totalLessons,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch lesson detail.');
  }
}