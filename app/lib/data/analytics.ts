import { db } from "../db";
import { quiz_attempts, user_lesson_progress, lessons, courses, categories, sections } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function getOverviewStats(userId: string) {
  try {
    // 1. XP Earned this week
    // XP từ quiz
    const quizXpResult = await db.select({ xp: sql<number>`sum(${quiz_attempts.xp_earned})` })
      .from(quiz_attempts)
      .where(and(
        eq(quiz_attempts.user_id, userId),
        sql`${quiz_attempts.completed_at} >= NOW() - INTERVAL '7 days'`
      ));

    // XP từ bài học
    const lessonXpResult = await db.select({ xp: sql<number>`sum(${lessons.xp_reward})` })
      .from(user_lesson_progress)
      .innerJoin(lessons, eq(user_lesson_progress.lesson_id, lessons.id))
      .where(and(
        eq(user_lesson_progress.user_id, userId),
        eq(user_lesson_progress.status, 'completed'),
        sql`${user_lesson_progress.completed_at} >= NOW() - INTERVAL '7 days'`
      ));

    // TODO: Add XP from Daily Quests when implemented
    const weeklyXp = (Number(quizXpResult[0]?.xp) || 0) + (Number(lessonXpResult[0]?.xp) || 0);

    // 2. Lessons Learned
    const lessonsResult = await db.select({ count: sql<number>`count(*)` })
      .from(user_lesson_progress)
      .where(and(
        eq(user_lesson_progress.user_id, userId),
        eq(user_lesson_progress.status, 'completed')
      ));
    const lessonsCount = Number(lessonsResult[0]?.count) || 0;

    // 3. Study Time (Total hours)
    const timeResult = await db.select({ minutes: sql<number>`sum(${lessons.duration_minutes})` })
      .from(user_lesson_progress)
      .innerJoin(lessons, eq(user_lesson_progress.lesson_id, lessons.id))
      .where(and(
        eq(user_lesson_progress.user_id, userId),
        eq(user_lesson_progress.status, 'completed')
      ));
    const totalMinutes = Number(timeResult[0]?.minutes) || 0;
    const studyHours = (totalMinutes / 60).toFixed(1);

    // 4. Average Score
    const scoreResult = await db.select({
      avg: sql<number>`avg(cast(${quiz_attempts.score} as float) / ${quiz_attempts.total} * 100)`
    })
      .from(quiz_attempts)
      .where(eq(quiz_attempts.user_id, userId));
    const avgScore = Math.round(Number(scoreResult[0]?.avg) || 0);

    return [
      { label: 'This week', value: `${weeklyXp} XP`, icon: 'zap', color: 'blue' },
      { label: 'Lessons Learned', value: `${lessonsCount} lessons`, icon: 'book-open', color: 'green' },
      { label: 'Study Time', value: `${studyHours}h`, icon: 'clock', color: 'purple' },
      { label: 'Average Score', value: `${avgScore}%`, icon: 'target', color: 'orange' },
    ];
  } catch (error) {
    console.error('Failed to fetch overview stats:', error);
    return [];
  }
}

export async function getWeeklyActivity(userId: string) {
  try {
    const activityResult = await db.select({
      date: sql<string>`DATE(${user_lesson_progress.completed_at})`,
      minutes: sql<number>`sum(${lessons.duration_minutes})`,
      lessonsCount: sql<number>`count(*)`
    })
      .from(user_lesson_progress)
      .innerJoin(lessons, eq(user_lesson_progress.lesson_id, lessons.id))
      .where(and(
        eq(user_lesson_progress.user_id, userId),
        eq(user_lesson_progress.status, 'completed'),
        sql`${user_lesson_progress.completed_at} >= CURRENT_DATE - INTERVAL '6 days'`
      ))
      .groupBy(sql`DATE(${user_lesson_progress.completed_at})`);

    // Tạo mảng 7 ngày gần nhất
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];

    // Khởi tạo mảng với 0 giờ
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      const dateString = d.toISOString().split('T')[0]; // YYYY-MM-DD

      const found = activityResult.find(r => r.date === dateString);
      const hours = found ? Number((Number(found.minutes) / 60).toFixed(1)) : 0;
      const lessonsCount = found ? Number(found.lessonsCount) : 0;

      result.push({
        day: dayName,
        hours: hours,
        lessons: lessonsCount,
        date: dateString
      });
    }

    return result;
  } catch (error) {
    console.error('Failed to fetch weekly activity:', error);
    return [];
  }
}

export async function getSubjectBreakdown(userId: string) {
  try {
    const breakdownResult = await db.select({
      subject: categories.name,
      color: courses.theme_color,
      minutes: sql<number>`sum(${lessons.duration_minutes})`
    })
      .from(user_lesson_progress)
      .innerJoin(lessons, eq(user_lesson_progress.lesson_id, lessons.id))
      .innerJoin(sections, eq(lessons.section_id, sections.id))
      .innerJoin(courses, eq(sections.course_id, courses.id))
      .innerJoin(categories, eq(courses.category_id, categories.id))
      .where(and(
        eq(user_lesson_progress.user_id, userId),
        eq(user_lesson_progress.status, 'completed')
      ))
      .groupBy(categories.id, courses.theme_color);

    const totalMinutes = breakdownResult.reduce((sum, r) => sum + Number(r.minutes), 0);

    return breakdownResult.map(r => {
      const hours = Math.round(Number(r.minutes) / 60);
      const percentage = totalMinutes > 0 ? Math.round((Number(r.minutes) / totalMinutes) * 100) : 0;

      return {
        subject: r.subject,
        percentage,
        color: `bg-${r.color}-500`,
        hours
      };
    }).sort((a, b) => b.percentage - a.percentage);

  } catch (error) {
    console.error('Failed to fetch subject breakdown:', error);
    return [];
  }
}

export async function getWeeklyXP(userId: string) {
  try {
    // Lấy XP từ quizzes trong 7 ngày
    const quizXpResult = await db.select({
      date: sql<string>`DATE(${quiz_attempts.completed_at})`,
      xp: sql<number>`sum(${quiz_attempts.xp_earned})`
    })
      .from(quiz_attempts)
      .where(and(
        eq(quiz_attempts.user_id, userId),
        sql`${quiz_attempts.completed_at} >= CURRENT_DATE - INTERVAL '6 days'`
      ))
      .groupBy(sql`DATE(${quiz_attempts.completed_at})`);

    // Lấy XP từ lessons trong 7 ngày
    const lessonXpResult = await db.select({
      date: sql<string>`DATE(${user_lesson_progress.completed_at})`,
      xp: sql<number>`sum(${lessons.xp_reward})`
    })
      .from(user_lesson_progress)
      .innerJoin(lessons, eq(user_lesson_progress.lesson_id, lessons.id))
      .where(and(
        eq(user_lesson_progress.user_id, userId),
        eq(user_lesson_progress.status, 'completed'),
        sql`${user_lesson_progress.completed_at} >= CURRENT_DATE - INTERVAL '6 days'`
      ))
      .groupBy(sql`DATE(${user_lesson_progress.completed_at})`);

    // Gộp kết quả
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      const dateString = d.toISOString().split('T')[0];

      const quizXp = quizXpResult.find(r => r.date === dateString)?.xp || 0;
      const lessonXp = lessonXpResult.find(r => r.date === dateString)?.xp || 0;

      result.push({
        day: dayName,
        xp: Number(quizXp) + Number(lessonXp)
      });
    }

    return result;
  } catch (error) {
    console.error('Failed to fetch weekly XP:', error);
    return [];
  }
}
