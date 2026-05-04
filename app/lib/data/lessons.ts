import { db } from "../db";
import * as schema from "../db/schema";
import { eq, sql, getTableColumns, and } from "drizzle-orm";
import { CourseCurriculum, DetailLesson } from "../definitions/lessons";

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
        userProgressMap.set(p.lesson_id, p.status || 'locked');
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
            completed: status === 'completed',
            locked: status === 'locked' || !status,
            isCurrent: status === 'unlocked' || status === 'in_progress',
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

    // 3. Check if user has already completed this lesson
    let isCompleted = false;
    if (userId) {
      const progressData = await db
        .select({ status: schema.user_lesson_progress.status })
        .from(schema.user_lesson_progress)
        .where(
          and(
            eq(schema.user_lesson_progress.user_id, userId),
            eq(schema.user_lesson_progress.lesson_id, lessonId)
          )
        )
        .limit(1);

      isCompleted = progressData.length > 0 && progressData[0].status === 'completed';
    }

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
      isCompleted,
      lessonNumber,
      totalLessons,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch lesson detail.');
  }
}

/**
 * Tìm ID bài học tiếp theo trong course, theo thứ tự section → lesson order_index.
 * Trả về null nếu đây là bài cuối cùng.
 */
export async function getNextLessonId(courseId: number, currentLessonId: number): Promise<number | null> {
  try {
    const courseLessons = await db
      .select({ id: schema.lessons.id })
      .from(schema.lessons)
      .innerJoin(schema.sections, eq(schema.lessons.section_id, schema.sections.id))
      .where(eq(schema.sections.course_id, courseId))
      .orderBy(schema.sections.order_index, schema.lessons.order_index);

    const currentIndex = courseLessons.findIndex(l => l.id === currentLessonId);

    if (currentIndex !== -1 && currentIndex < courseLessons.length - 1) {
      return courseLessons[currentIndex + 1].id;
    }

    return null;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

/**
 * Lấy ghi chú của user cho bài học cụ thể
 */
export async function getLessonNote(lessonId: number, userId: string): Promise<string | null> {
  try {
    const noteData = await db
      .select({ content: schema.lesson_notes.content })
      .from(schema.lesson_notes)
      .where(
        and(
          eq(schema.lesson_notes.user_id, userId),
          eq(schema.lesson_notes.lesson_id, lessonId)
        )
      )
      .limit(1);

    if (noteData.length > 0) {
      return noteData[0].content;
    }
    return null;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}