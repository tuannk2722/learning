import { db } from "../db";
import { quiz_attempts, user_lesson_progress, lessons, user_daily_quests, daily_quest_definitions, user_achievements, achievements } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";


function generateLast7Days() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push({
      dayName: days[d.getDay()],
      dateString: d.toISOString().split('T')[0]
    });
  }
  return dates;
}

async function fetchWeeklyXpSources(userId: string) {
  const [quiz, lesson, dailyQuest, achievement] = await Promise.all([
    // Quizzes XP
    db.select({
      date: sql<string>`DATE(${quiz_attempts.completed_at})`,
      xp: sql<number>`sum(${quiz_attempts.xp_earned})`
    })
      .from(quiz_attempts)
      .where(and(
        eq(quiz_attempts.user_id, userId),
        sql`${quiz_attempts.completed_at} >= CURRENT_DATE - INTERVAL '6 days'`
      ))
      .groupBy(sql`DATE(${quiz_attempts.completed_at})`),

    // Lessons XP
    db.select({
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
      .groupBy(sql`DATE(${user_lesson_progress.completed_at})`),

    // Daily Quests XP
    db.select({
      date: sql<string>`DATE(${user_daily_quests.completed_at})`,
      xp: sql<number>`sum(${daily_quest_definitions.reward_xp})`
    })
      .from(user_daily_quests)
      .innerJoin(daily_quest_definitions, eq(user_daily_quests.quest_id, daily_quest_definitions.id))
      .where(and(
        eq(user_daily_quests.user_id, userId),
        eq(user_daily_quests.is_completed, true),
        sql`${user_daily_quests.completed_at} >= CURRENT_DATE - INTERVAL '6 days'`
      ))
      .groupBy(sql`DATE(${user_daily_quests.completed_at})`),

    // Achievements XP
    db.select({
      date: sql<string>`DATE(${user_achievements.unlocked_at})`,
      xp: sql<number>`sum(${achievements.reward_xp})`
    })
      .from(user_achievements)
      .innerJoin(achievements, eq(user_achievements.achievement_id, achievements.id))
      .where(and(
        eq(user_achievements.user_id, userId),
        sql`${user_achievements.unlocked_at} >= CURRENT_DATE - INTERVAL '6 days'`
      ))
      .groupBy(sql`DATE(${user_achievements.unlocked_at})`)
  ]);

  return { quiz, lesson, dailyQuest, achievement };
}

export async function getOverviewStats(userId: string) {
  try {
    const [weeklyXpSources, lessonsResult, timeResult, scoreResult] = await Promise.all([
      fetchWeeklyXpSources(userId),
      db.select({ count: sql<number>`count(*)` })
        .from(user_lesson_progress)
        .where(and(
          eq(user_lesson_progress.user_id, userId),
          eq(user_lesson_progress.status, 'completed')
        )),
      db.select({ minutes: sql<number>`sum(${lessons.duration_minutes})` })
        .from(user_lesson_progress)
        .innerJoin(lessons, eq(user_lesson_progress.lesson_id, lessons.id))
        .where(and(
          eq(user_lesson_progress.user_id, userId),
          eq(user_lesson_progress.status, 'completed')
        )),
      db.select({ avg: sql<number>`avg(cast(${quiz_attempts.score} as float) / ${quiz_attempts.total} * 100)` })
        .from(quiz_attempts)
        .where(eq(quiz_attempts.user_id, userId))
    ]);

    // 1. Tính tổng XP trong tuần từ các nguồn
    const sumXp = (arr: { xp: number }[]) => arr.reduce((sum, r) => sum + Number(r.xp || 0), 0);
    const weeklyXp =
      sumXp(weeklyXpSources.quiz) +
      sumXp(weeklyXpSources.lesson) +
      sumXp(weeklyXpSources.dailyQuest) +
      sumXp(weeklyXpSources.achievement);

    // 2-4. Các số liệu khác
    const lessonsCount = Number(lessonsResult[0]?.count) || 0;
    const totalMinutes = Number(timeResult[0]?.minutes) || 0;
    const studyHours = (totalMinutes / 60).toFixed(1);
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

    const result = [];
    for (const { dayName, dateString } of generateLast7Days()) {
      const found = activityResult.find(r => r.date === dateString);
      result.push({
        day: dayName,
        hours: found ? Number((Number(found.minutes) / 60).toFixed(1)) : 0,
        lessons: found ? Number(found.lessonsCount) : 0,
        date: dateString
      });
    }

    return result;
  } catch (error) {
    console.error('Failed to fetch weekly activity:', error);
    return [];
  }
}

export async function getWeeklyXP(userId: string) {
  try {
    const { quiz, lesson, dailyQuest, achievement } = await fetchWeeklyXpSources(userId);

    const result = [];
    for (const { dayName, dateString } of generateLast7Days()) {
      const quizXp = quiz.find(r => r.date === dateString)?.xp || 0;
      const lessonXp = lesson.find(r => r.date === dateString)?.xp || 0;
      const dailyQuestXp = dailyQuest.find(r => r.date === dateString)?.xp || 0;
      const achievementXp = achievement.find(r => r.date === dateString)?.xp || 0;

      result.push({
        day: dayName,
        xp: Number(quizXp) + Number(lessonXp) + Number(dailyQuestXp) + Number(achievementXp)
      });
    }

    return result;
  } catch (error) {
    console.error('Failed to fetch weekly XP:', error);
    return [];
  }
}
