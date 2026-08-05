import { db } from "../db";
import {
  quiz_attempts, user_lesson_progress, lessons,
  user_daily_quests, daily_quest_definitions,
  user_achievements, achievements,
  users, courses, enrollments, activity_logs,
  flashcard_sets, flashcard_card_progress
} from "../db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { FlashcardCardStatus, FlashcardDailyReview, FlashcardSetMastery } from "../definitions/definitions";
import { getSetsMasteryByIds } from "./flashcard";


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
    const [weeklyXpSources, lessonsResult, flashcardSetsResult, scoreResult] = await Promise.all([
      fetchWeeklyXpSources(userId),
      db.select({ count: sql<number>`count(*)` })
        .from(user_lesson_progress)
        .where(and(
          eq(user_lesson_progress.user_id, userId),
          eq(user_lesson_progress.status, 'completed')
        )),
      db.select({ count: sql<number>`count(*)` })
        .from(flashcard_sets)
        .where(eq(flashcard_sets.owner_id, userId)),
      db.select({ avg: sql<number>`avg(cast(${quiz_attempts.score} as float) / ${quiz_attempts.total} * 100)` })
        .from(quiz_attempts)
        .where(eq(quiz_attempts.user_id, userId))
    ]);

    const sumXp = (arr: { xp: number }[]) => arr.reduce((sum, r) => sum + Number(r.xp || 0), 0);
    const weeklyXp =
      sumXp(weeklyXpSources.quiz) +
      sumXp(weeklyXpSources.lesson) +
      sumXp(weeklyXpSources.dailyQuest) +
      sumXp(weeklyXpSources.achievement);

    const lessonsCount = Number(lessonsResult[0]?.count) || 0;
    const flashcardSetsCount = Number(flashcardSetsResult[0]?.count) || 0;
    const avgScore = Math.round(Number(scoreResult[0]?.avg) || 0);

    return [
      { label: 'This week', value: `${weeklyXp} XP`, icon: 'zap', color: 'blue' },
      { label: 'Lessons Learned', value: `${lessonsCount} lessons`, icon: 'book-open', color: 'green' },
      { label: 'Flashcard Sets', value: `${flashcardSetsCount} sets`, icon: 'layers', color: 'purple' },
      { label: 'Average quizzes score', value: `${avgScore}%`, icon: 'target', color: 'orange' },
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


export async function getAdminDashboardData() {
  const last7Days = generateLast7Days();

  const [
    totalUsersResult,
    publishedCoursesResult,
    flashcardSetsResult,
    lessonsCompletedResult,
    badgesAwardedResult,
    dauResult,
    weeklyLessonsResult,
    topCoursesResult,
    topAchievementsResult,
    enrollmentTrendsResult,
  ] = await Promise.all([
    // 1. Tổng số user đã onboarded
    db.select({ count: sql<number>`cast(count(*) as int)` })
      .from(users)
      .where(eq(users.is_onboarded, true)),

    // 2. Khóa học đã published
    db.select({ count: sql<number>`cast(count(*) as int)` })
      .from(courses)
      .where(eq(courses.status, 'published')),

    // 3. Tổng số flashcard sets đã tạo
    db.select({ count: sql<number>`cast(count(*) as int)` })
      .from(flashcard_sets),

    // 4. Tổng số lessons đã hoàn thành
    db.select({ count: sql<number>`cast(count(*) as int)` })
      .from(user_lesson_progress)
      .where(eq(user_lesson_progress.status, 'completed')),

    // 5. Tổng số lần unlock achievement
    db.select({ count: sql<number>`cast(count(*) as int)` })
      .from(user_achievements),

    // 6. DAU chart: đếm số lượng active users theo ngày từ activity_logs (mỗi user có ít nhất 1 bản ghi activity log)
    db.select({
      date: sql<string>`DATE(${activity_logs.created_at})`,
      users: sql<number>`cast(count(distinct ${activity_logs.user_id}) as int)`,
    })
      .from(activity_logs)
      .where(and(
        sql`${activity_logs.user_id} IS NOT NULL`,
        sql`${activity_logs.created_at} >= CURRENT_DATE - INTERVAL '6 days'`
      ))
      .groupBy(sql`DATE(${activity_logs.created_at})`),

    // 7. Lessons Completed chart: số lesson hoàn thành theo ngày
    db.select({
      date: sql<string>`DATE(${user_lesson_progress.completed_at})`,
      count: sql<number>`cast(count(*) as int)`,
    })
      .from(user_lesson_progress)
      .where(and(
        eq(user_lesson_progress.status, 'completed'),
        sql`${user_lesson_progress.completed_at} >= CURRENT_DATE - INTERVAL '6 days'`
      ))
      .groupBy(sql`DATE(${user_lesson_progress.completed_at})`),

    // 8. Top Courses: tổng enrollments + completion rate
    db.select({
      id: courses.id,
      name: courses.name,
      enrollments: sql<number>`cast(count(${enrollments.user_id}) as int)`,
      completions: sql<number>`cast(sum(case when ${enrollments.status} = 'COMPLETED' then 1 else 0 end) as int)`,
      rating: courses.rating,
    })
      .from(courses)
      .leftJoin(enrollments, eq(courses.id, enrollments.course_id))
      .where(eq(courses.status, 'published'))
      .groupBy(courses.id, courses.name)
      .orderBy(desc(sql`count(${enrollments.user_id})`)),

    // 9. Recent Achievements: 10 achievement được unlock nhiều nhất
    db.select({
      name: achievements.title,
      iconName: achievements.icon_name,
      themeColor: achievements.theme_color,
      awarded: sql<number>`cast(count(${user_achievements.user_id}) as int)`,
    })
      .from(user_achievements)
      .innerJoin(achievements, eq(user_achievements.achievement_id, achievements.id))
      .groupBy(achievements.id, achievements.title)
      .orderBy(desc(sql`count(${user_achievements.user_id})`))
      .limit(10),

    // 10. Enrollment Trends: thống kê enrollments, completions, drop-offs theo tháng (6 tháng gần nhất)
    db.select({
      month: sql<string>`to_char(${enrollments.enrolled_at}, 'Mon')`,
      monthIndex: sql<number>`cast(extract(month from ${enrollments.enrolled_at}) as int)`,
      yearVal: sql<number>`cast(extract(year from ${enrollments.enrolled_at}) as int)`,
      enrollments: sql<number>`cast(count(*) as int)`,
      completions: sql<number>`cast(sum(case when ${enrollments.status} = 'COMPLETED' then 1 else 0 end) as int)`,
    })
      .from(enrollments)
      .where(sql`${enrollments.enrolled_at} >= date_trunc('month', CURRENT_DATE) - INTERVAL '5 months'`)
      .groupBy(
        sql`to_char(${enrollments.enrolled_at}, 'Mon')`,
        sql`extract(month from ${enrollments.enrolled_at})`,
        sql`extract(year from ${enrollments.enrolled_at})`,
      )
      .orderBy(
        sql`extract(year from ${enrollments.enrolled_at})`,
        sql`extract(month from ${enrollments.enrolled_at})`,
      ),
  ]);

  const totalUsers = totalUsersResult[0]?.count ?? 0;
  const publishedCourses = publishedCoursesResult[0]?.count ?? 0;
  const flashcardSets = flashcardSetsResult[0]?.count ?? 0;
  const lessonsCompleted = lessonsCompletedResult[0]?.count ?? 0;
  const badgesAwarded = badgesAwardedResult[0]?.count ?? 0;

  const stats = [
    { label: 'Total Users', value: totalUsers.toLocaleString(), icon: 'users', color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Courses Published', value: publishedCourses.toLocaleString(), icon: 'book-open', color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Flashcard Sets', value: flashcardSets.toLocaleString(), icon: 'layers', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Achievements Awarded', value: badgesAwarded.toLocaleString(), icon: 'trophy', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Lessons Completed', value: lessonsCompleted.toLocaleString(), icon: 'target', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  const dailyActiveUsers = last7Days.map(({ dayName, dateString }) => {
    const found = dauResult.find(r => r.date === dateString);
    return { day: dayName, users: found?.users ?? 0 };
  });

  const weeklyLessons = last7Days.map(({ dayName, dateString }) => {
    const found = weeklyLessonsResult.find(r => r.date === dateString);
    return { day: dayName, count: found?.count ?? 0 };
  });

  const topCourses = topCoursesResult.map((c) => ({
    name: c.name,
    enrollments: c.enrollments,
    completionRate: Number((c.completions / c.enrollments * 100).toFixed(1)),
    rating: c.rating ?? '0',
  }));

  const topAchievements = topAchievementsResult.map(b => ({
    name: b.name,
    iconName: b.iconName ?? 'Trophy',
    themeColor: b.themeColor ?? 'gray',
    awarded: b.awarded,
  }));

  const enrollmentTrends = enrollmentTrendsResult.map(r => ({
    month: r.month,
    enrollments: r.enrollments,
    completions: r.completions,
  }));

  return { stats, dailyActiveUsers, weeklyLessons, topCourses, topAchievements, enrollmentTrends };
}


export type FlashcardAnalyticsData = {
  dailyReviews: FlashcardDailyReview[];
  cardStatus: FlashcardCardStatus[];
  setMastery: FlashcardSetMastery[];
  totalCards: number;
};

export async function getFlashcardAnalytics(userId: string): Promise<FlashcardAnalyticsData> {
  try {
    // 0. Xác định 4 set gần đây nhất có card_progress
    const recentSetsRaw = await db
      .select({
        setId: flashcard_card_progress.set_id,
        lastStudiedAt: sql<string>`max(${flashcard_card_progress.updated_at})`,
      })
      .from(flashcard_card_progress)
      .where(eq(flashcard_card_progress.user_id, userId))
      .groupBy(flashcard_card_progress.set_id)
      .orderBy(sql`max(${flashcard_card_progress.updated_at}) desc`)
      .limit(4);

    const recentSetIds = recentSetsRaw.map((s) => s.setId);

    const [dailyProgress, allProgressStatus, masteryList] = await Promise.all([
      // 1. Daily flashcard set studied over last 7 days
      db
        .select({
          date: sql<string>`DATE(${activity_logs.created_at})`,
          count: sql<number>`count(*)`,
        })
        .from(activity_logs)
        .where(
          and(
            eq(activity_logs.user_id, userId),
            eq(activity_logs.action, 'COMPLETE_FLASHCARD_SESSION'),
            sql`${activity_logs.created_at} >= CURRENT_DATE - INTERVAL '6 days'`
          )
        )
        .groupBy(sql`DATE(${activity_logs.created_at})`)
        .orderBy(sql`DATE(${activity_logs.created_at})`),

      // 2. Status breakdown TOÀN BỘ progress của user (dùng cho cardStatus)
      db
        .select({
          status: flashcard_card_progress.status,
          count: sql<number>`count(*)`,
        })
        .from(flashcard_card_progress)
        .where(eq(flashcard_card_progress.user_id, userId))
        .groupBy(flashcard_card_progress.status),

      // 3. Mastery per set — dùng hàm chung (pct = correct/totalCards)
      recentSetIds.length === 0
        ? Promise.resolve([])
        : getSetsMasteryByIds(userId, recentSetIds),
    ]);

    // Map daily reviews
    const dailyReviews: FlashcardDailyReview[] = generateLast7Days().map(({ dayName, dateString }) => {
      const totalCount = Number(
        dailyProgress.find((r) => r.date === dateString)?.count || 0
      );
      return { day: dayName, total: totalCount };
    });

    // Map set mastery — dùng kết quả từ hàm chung (pct = correct/totalCards)
    const setMastery: FlashcardSetMastery[] = masteryList.map((s) => ({
      name: s.title.length > 20 ? s.title.slice(0, 20) + '\u2026' : s.title,
      mastered: s.correctCards,
      total: s.totalCards,
      pct: s.pct,
    }));

    const totalMastered = Number(
      allProgressStatus.find((p) => p.status === 'correct')?.count || 0
    );
    const totalStillLearning = Number(
      allProgressStatus.find((p) => p.status === 'incorrect')?.count || 0
    );
    const totalCards = totalMastered + totalStillLearning;

    const cardStatus: FlashcardCardStatus[] = [
      { name: "Known", value: totalMastered, color: "#10b981" },
      { name: "Still learning", value: totalStillLearning, color: "#f87171" },
    ];

    return {
      dailyReviews,
      cardStatus,
      setMastery,
      totalCards,
    };
  } catch (error) {
    console.error("Failed to fetch flashcard analytics:", error);
    return {
      dailyReviews: [],
      cardStatus: [],
      setMastery: [],
      totalCards: 0,
    };
  }
}