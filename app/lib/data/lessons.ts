import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { CourseCurriculum, DetailLesson } from "../definitions/lessons";

export async function getCourseCurriculum(
  courseId: number,
  userId?: string
): Promise<CourseCurriculum> {
  try {
    // 1. Lấy tất cả các section theo thứ tự
    const allSections = await db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.course_id, courseId))
      .orderBy(schema.sections.order_index);

    // 2. Lấy bài học
    const allLessons = await db
      .select({
        id: schema.lessons.id,
        section_id: schema.lessons.section_id,
        title: schema.lessons.title,
        duration: schema.lessons.duration_minutes,
        xp: schema.lessons.xp_reward,
        order_index: schema.lessons.order_index,
        status: schema.lessons.status,
      })
      .from(schema.lessons)
      .innerJoin(schema.sections, eq(schema.lessons.section_id, schema.sections.id))
      .where(and(
        eq(schema.sections.course_id, courseId),
        eq(schema.lessons.status, 'published')
      ))
      .orderBy(schema.sections.order_index, schema.lessons.order_index);

    // 3. Lấy tiến độ của user — chỉ cần biết lesson nào đã 'completed'
    const completedSet = new Set<number>(); // ID các lesson đã hoàn thành
    let hasAnyProgressForCourse = false;    // true = user đã enrolled (có bất kỳ record nào)

    if (userId && allLessons.length > 0) {
      const lessonIdsInCourse = allLessons.map(l => l.id);
      const progressData = await db
        .select({
          lesson_id: schema.user_lesson_progress.lesson_id,
          status: schema.user_lesson_progress.status,
        })
        .from(schema.user_lesson_progress)
        .where(and(
          eq(schema.user_lesson_progress.user_id, userId),
          inArray(schema.user_lesson_progress.lesson_id, lessonIdsInCourse) // chỉ query lesson của course này
        ));

      progressData.forEach(p => {
        hasAnyProgressForCourse = true; // có ít nhất 1 record = đã enrolled
        if (p.status === 'completed') completedSet.add(p.lesson_id);
      });
    }

    // 4. Build global index map để biết bài liền kề trước của từng lesson là bài nào
    const lessonGlobalIndexMap = new Map<number, number>();
    allLessons.forEach((l, i) => lessonGlobalIndexMap.set(l.id, i));

    const isAccessible = (lessonId: number): boolean => {
      const i = lessonGlobalIndexMap.get(lessonId) ?? -1;
      if (i === -1) return false;
      if (completedSet.has(lessonId)) return true;                             // đã hoàn thành
      if (i === 0 && hasAnyProgressForCourse) return true;                     // bài đầu, enrolled
      if (i > 0 && completedSet.has(allLessons[i - 1].id)) return true;       // bài trước đã xong
      return false;
    };

    // 5. Nhóm bài học vào section
    const curriculum: CourseCurriculum = allSections.map((section) => {
      const sectionLessons = allLessons
        .filter((lesson) => lesson.section_id === section.id)
        .map((lesson) => {
          const completed = completedSet.has(lesson.id);
          const accessible = isAccessible(lesson.id);
          return {
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration || 0,
            xp: lesson.xp || 0,
            completed,
            locked: !accessible,
            isCurrent: accessible && !completed, // play button cho bài chưa xong nhưng accessible
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
        xp_reward: schema.lessons.xp_reward,
        duration_minutes: schema.lessons.duration_minutes,
        course_id: schema.sections.course_id,
        courseTitle: schema.courses.name,
        blocks: schema.lessons.blocks,
        status: schema.lessons.status,
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

    // 2. Lấy danh sách ID bài học trong khóa học để tính số thứ tự
    const lessonsInCourse = await db
      .select({ id: schema.lessons.id })
      .from(schema.lessons)
      .innerJoin(schema.sections, eq(schema.lessons.section_id, schema.sections.id))
      .where(and(
        eq(schema.sections.course_id, lesson.course_id!),
        eq(schema.lessons.status, 'published')
      ))
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

    return {
      id: lesson.id,
      title: lesson.title,
      xp_reward: lesson.xp_reward || 0,
      duration_minutes: lesson.duration_minutes || 0,
      course_id: lesson.course_id,
      courseTitle: lesson.courseTitle || 'Unknown Course',
      isCompleted,
      lessonNumber,
      totalLessons,
      blocks: lesson.blocks as any,
      status: lesson.status || 'draft',
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch lesson detail.');
  }
}

export async function getNextLessonId(courseId: number, currentLessonId: number): Promise<number | null> {
  try {
    // Chỉ xét published lessons khi navigate — tránh redirect tới lesson draft
    const courseLessons = await db
      .select({ id: schema.lessons.id })
      .from(schema.lessons)
      .innerJoin(schema.sections, eq(schema.lessons.section_id, schema.sections.id))
      .where(and(
        eq(schema.sections.course_id, courseId),
        eq(schema.lessons.status, 'published')
      ))
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

export async function getLessonById(lessonId: number) {
  try {
    const lesson = await db
      .select()
      .from(schema.lessons)
      .where(eq(schema.lessons.id, lessonId))
      .limit(1);
    if (lesson.length === 0) {
      return null;
    }
    return lesson[0];
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}