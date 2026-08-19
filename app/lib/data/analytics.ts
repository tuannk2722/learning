import { db } from "../db";
import {
  quiz_attempts, user_lesson_progress, lessons,
  user_daily_quests, daily_quest_definitions,
  user_achievements, achievements,
  users, courses, enrollments, activity_logs,
  flashcard_sets, flashcard_card_progress
} from "../db/schema";
import { eq, and, sql, desc, gte } from "drizzle-orm";
import { FlashcardCardStatus, FlashcardDailyReview, FlashcardSetMastery } from "../definitions/definitions";
import { getSetsMasteryByIds } from "./flashcard";
import {
  TimeRange,
  getTimeRangeConfig,
  generateDateBuckets,
  matchDateToBucket
} from "../utils/date-range";

async function fetchXpSources(userId: string, rangeInput?: string | null) {
  const { startDate } = getTimeRangeConfig(rangeInput);

  const [quiz, lesson, dailyQuest, achievement] = await Promise.all([
    // Quizzes XP
    db.select({
      date: sql<string>`to_char(${quiz_attempts.completed_at}, 'YYYY-MM-DD')`,
      xp: sql<number>`sum(${quiz_attempts.xp_earned})`
    })
      .from(quiz_attempts)
      .where(and(
        eq(quiz_attempts.user_id, userId),
        gte(quiz_attempts.completed_at, startDate)
      ))
      .groupBy(sql`to_char(${quiz_attempts.completed_at}, 'YYYY-MM-DD')`),

    // Lessons XP
    db.select({
      date: sql<string>`to_char(${user_lesson_progress.completed_at}, 'YYYY-MM-DD')`,
      xp: sql<number>`sum(${lessons.xp_reward})`
    })
      .from(user_lesson_progress)
      .innerJoin(lessons, eq(user_lesson_progress.lesson_id, lessons.id))
      .where(and(
        eq(user_lesson_progress.user_id, userId),
        eq(user_lesson_progress.status, 'completed'),
        gte(user_lesson_progress.completed_at, startDate)
      ))
      .groupBy(sql`to_char(${user_lesson_progress.completed_at}, 'YYYY-MM-DD')`),

    // Daily Quests XP
    db.select({
      date: sql<string>`to_char(${user_daily_quests.completed_at}, 'YYYY-MM-DD')`,
      xp: sql<number>`sum(${daily_quest_definitions.reward_xp})`
    })
      .from(user_daily_quests)
      .innerJoin(daily_quest_definitions, eq(user_daily_quests.quest_id, daily_quest_definitions.id))
      .where(and(
        eq(user_daily_quests.user_id, userId),
        eq(user_daily_quests.is_completed, true),
        gte(user_daily_quests.completed_at, startDate)
      ))
      .groupBy(sql`to_char(${user_daily_quests.completed_at}, 'YYYY-MM-DD')`),

    // Achievements XP
    db.select({
      date: sql<string>`to_char(${user_achievements.unlocked_at}, 'YYYY-MM-DD')`,
      xp: sql<number>`sum(${achievements.reward_xp})`
    })
      .from(user_achievements)
      .innerJoin(achievements, eq(user_achievements.achievement_id, achievements.id))
      .where(and(
        eq(user_achievements.user_id, userId),
        gte(user_achievements.unlocked_at, startDate)
      ))
      .groupBy(sql`to_char(${user_achievements.unlocked_at}, 'YYYY-MM-DD')`)
  ]);

  return { quiz, lesson, dailyQuest, achievement };
}

export async function getOverviewStats(userId: string, rangeInput?: string | null) {
  try {
    const { range, startDate } = getTimeRangeConfig(rangeInput);
    const [xpSources, lessonsResult, flashcardSetsResult, scoreResult] = await Promise.all([
      fetchXpSources(userId, rangeInput),
      db.select({ count: sql<number>`count(*)` })
        .from(user_lesson_progress)
        .where(and(
          eq(user_lesson_progress.user_id, userId),
          eq(user_lesson_progress.status, 'completed'),
          gte(user_lesson_progress.completed_at, startDate)
        )),
      db.select({ count: sql<number>`count(*)` })
        .from(flashcard_sets)
        .where(and(
          eq(flashcard_sets.owner_id, userId),
          gte(flashcard_sets.created_at, startDate)
        )),
      db.select({ avg: sql<number>`avg(cast(${quiz_attempts.score} as float) / ${quiz_attempts.total} * 100)` })
        .from(quiz_attempts)
        .where(and(
          eq(quiz_attempts.user_id, userId),
          gte(quiz_attempts.completed_at, startDate)
        ))
    ]);

    const sumXp = (arr: { xp: number }[]) => arr.reduce((sum, r) => sum + Number(r.xp || 0), 0);
    const totalPeriodXp =
      sumXp(xpSources.quiz) +
      sumXp(xpSources.lesson) +
      sumXp(xpSources.dailyQuest) +
      sumXp(xpSources.achievement);

    const lessonsCount = Number(lessonsResult[0]?.count) || 0;
    const flashcardSetsCount = Number(flashcardSetsResult[0]?.count) || 0;
    const avgScore = scoreResult[0]?.avg !== null && scoreResult[0]?.avg !== undefined
      ? `${Math.round(Number(scoreResult[0].avg))}%`
      : '0%';

    const xpLabelMap: Record<TimeRange, string> = {
      '7d': 'Last 7 days XP',
      '30d': 'Last 30 days XP',
      '90d': 'Last 90 days XP',
      '1y': 'Last 1 year XP',
    };

    return [
      { label: xpLabelMap[range] || 'Period XP', value: `${totalPeriodXp.toLocaleString()} XP`, icon: 'zap', color: 'blue' },
      { label: 'Lessons Learned', value: `${lessonsCount} lessons`, icon: 'book-open', color: 'green' },
      { label: 'Flashcard Sets', value: `${flashcardSetsCount} sets`, icon: 'layers', color: 'purple' },
      { label: 'Average quizzes score', value: avgScore, icon: 'target', color: 'orange' },
    ];
  } catch (error) {
    console.error('Failed to fetch overview stats:', error);
    return [];
  }
}

export async function getWeeklyActivity(userId: string, rangeInput?: string | null) {
  try {
    const { startDate, granularity } = getTimeRangeConfig(rangeInput);
    const buckets = generateDateBuckets(rangeInput);

    const activityResult = await db.select({
      date: sql<string>`to_char(${user_lesson_progress.completed_at}, 'YYYY-MM-DD')`,
      minutes: sql<number>`sum(${lessons.duration_minutes})`,
      lessonsCount: sql<number>`count(*)`
    })
      .from(user_lesson_progress)
      .innerJoin(lessons, eq(user_lesson_progress.lesson_id, lessons.id))
      .where(and(
        eq(user_lesson_progress.user_id, userId),
        eq(user_lesson_progress.status, 'completed'),
        gte(user_lesson_progress.completed_at, startDate)
      ))
      .groupBy(sql`to_char(${user_lesson_progress.completed_at}, 'YYYY-MM-DD')`);

    return buckets.map(bucket => {
      const matchingRows = activityResult.filter(r => matchDateToBucket(r.date, bucket, granularity));
      const totalMinutes = matchingRows.reduce((sum, r) => sum + Number(r.minutes || 0), 0);
      const totalLessons = matchingRows.reduce((sum, r) => sum + Number(r.lessonsCount || 0), 0);

      return {
        day: bucket.label,
        hours: Number((totalMinutes / 60).toFixed(1)),
        lessons: totalLessons,
        date: bucket.key
      };
    });
  } catch (error) {
    console.error('Failed to fetch lesson activity:', error);
    return [];
  }
}

export async function getWeeklyXP(userId: string, rangeInput?: string | null) {
  try {
    const { granularity } = getTimeRangeConfig(rangeInput);
    const buckets = generateDateBuckets(rangeInput);
    const { quiz, lesson, dailyQuest, achievement } = await fetchXpSources(userId, rangeInput);

    return buckets.map(bucket => {
      const sumMatching = (arr: { date: string; xp: number }[]) =>
        arr
          .filter(r => matchDateToBucket(r.date, bucket, granularity))
          .reduce((sum, r) => sum + Number(r.xp || 0), 0);

      const quizXp = sumMatching(quiz);
      const lessonXp = sumMatching(lesson);
      const dailyQuestXp = sumMatching(dailyQuest);
      const achievementXp = sumMatching(achievement);

      return {
        day: bucket.label,
        xp: quizXp + lessonXp + dailyQuestXp + achievementXp
      };
    });
  } catch (error) {
    console.error('Failed to fetch XP activity:', error);
    return [];
  }
}

export type FlashcardAnalyticsData = {
  dailyReviews: FlashcardDailyReview[];
  cardStatus: FlashcardCardStatus[];
  setMastery: FlashcardSetMastery[];
  totalCards: number;
};

export async function getFlashcardAnalytics(userId: string, rangeInput?: string | null): Promise<FlashcardAnalyticsData> {
  try {
    const { startDate, granularity } = getTimeRangeConfig(rangeInput);
    const buckets = generateDateBuckets(rangeInput);

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
      // 1. Flashcard sets session completed in period
      db
        .select({
          date: sql<string>`to_char(${activity_logs.created_at}, 'YYYY-MM-DD')`,
          count: sql<number>`count(*)`,
        })
        .from(activity_logs)
        .where(
          and(
            eq(activity_logs.user_id, userId),
            eq(activity_logs.action, 'COMPLETE_FLASHCARD_SESSION'),
            gte(activity_logs.created_at, startDate)
          )
        )
        .groupBy(sql`to_char(${activity_logs.created_at}, 'YYYY-MM-DD')`),

      // 2. Status breakdown TOÀN BỘ progress của user (dùng cho cardStatus)
      db
        .select({
          status: flashcard_card_progress.status,
          count: sql<number>`count(*)`,
        })
        .from(flashcard_card_progress)
        .where(eq(flashcard_card_progress.user_id, userId))
        .groupBy(flashcard_card_progress.status),

      // 3. Mastery per set
      recentSetIds.length === 0
        ? Promise.resolve([])
        : getSetsMasteryByIds(userId, recentSetIds),
    ]);

    // Map and zero-fill daily reviews
    const dailyReviews: FlashcardDailyReview[] = buckets.map(bucket => {
      const matching = dailyProgress.filter(r => matchDateToBucket(r.date, bucket, granularity));
      const totalCount = matching.reduce((sum, r) => sum + Number(r.count || 0), 0);
      return { day: bucket.label, total: totalCount };
    });

    // Map set mastery
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

export async function getAdminDashboardData(rangeInput?: string | null) {
  const { startDate, granularity } = getTimeRangeConfig(rangeInput);
  const buckets = generateDateBuckets(rangeInput);

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
    // 1. Tổng số user mới/onboarded trong khoảng thời gian đã chọn
    db.select({ count: sql<number>`cast(count(*) as int)` })
      .from(users)
      .where(and(
        eq(users.is_onboarded, true),
        gte(users.created_at, startDate)
      )),

    // 2. Khóa học đã tạo/published trong khoảng thời gian đã chọn
    db.select({ count: sql<number>`cast(count(*) as int)` })
      .from(courses)
      .where(and(
        eq(courses.status, 'published'),
        gte(courses.created_at, startDate)
      )),

    // 3. Tổng số flashcard sets đã tạo trong khoảng thời gian đã chọn
    db.select({ count: sql<number>`cast(count(*) as int)` })
      .from(flashcard_sets)
      .where(gte(flashcard_sets.created_at, startDate)),

    // 4. Tổng số lessons đã hoàn thành trong khoảng thời gian đã chọn
    db.select({ count: sql<number>`cast(count(*) as int)` })
      .from(user_lesson_progress)
      .where(and(
        eq(user_lesson_progress.status, 'completed'),
        gte(user_lesson_progress.completed_at, startDate)
      )),

    // 5. Tổng số lần unlock achievement trong khoảng thời gian đã chọn
    db.select({ count: sql<number>`cast(count(*) as int)` })
      .from(user_achievements)
      .where(gte(user_achievements.unlocked_at, startDate)),

    // 6. Active users theo ngày/tháng trong khoảng thời gian đã chọn
    db.select({
      date: sql<string>`to_char(${activity_logs.created_at}, 'YYYY-MM-DD')`,
      users: sql<number>`cast(count(distinct ${activity_logs.user_id}) as int)`,
    })
      .from(activity_logs)
      .where(and(
        sql`${activity_logs.user_id} IS NOT NULL`,
        gte(activity_logs.created_at, startDate)
      ))
      .groupBy(sql`to_char(${activity_logs.created_at}, 'YYYY-MM-DD')`),

    // 7. Lessons Completed chart trong khoảng thời gian đã chọn
    db.select({
      date: sql<string>`to_char(${user_lesson_progress.completed_at}, 'YYYY-MM-DD')`,
      count: sql<number>`cast(count(*) as int)`,
    })
      .from(user_lesson_progress)
      .where(and(
        eq(user_lesson_progress.status, 'completed'),
        gte(user_lesson_progress.completed_at, startDate)
      ))
      .groupBy(sql`to_char(${user_lesson_progress.completed_at}, 'YYYY-MM-DD')`),

    // 8. Top Courses
    db.select({
      id: courses.id,
      name: courses.name,
      enrollments: sql<number>`cast(count(${enrollments.user_id}) as int)`,
      completions: sql<number>`cast(sum(case when ${enrollments.status} = 'COMPLETED' then 1 else 0 end) as int)`,
      rating: courses.rating,
    })
      .from(courses)
      .leftJoin(
        enrollments,
        and(
          eq(courses.id, enrollments.course_id),
          gte(enrollments.enrolled_at, startDate)
        )
      )
      .where(eq(courses.status, 'published'))
      .groupBy(courses.id, courses.name)
      .orderBy(desc(sql`count(${enrollments.user_id})`)),

    // 9. Top Achievements unlocked trong khoảng thời gian đã chọn
    db.select({
      name: achievements.title,
      iconName: achievements.icon_name,
      themeColor: achievements.theme_color,
      awarded: sql<number>`cast(count(${user_achievements.user_id}) as int)`,
    })
      .from(user_achievements)
      .innerJoin(achievements, eq(user_achievements.achievement_id, achievements.id))
      .where(gte(user_achievements.unlocked_at, startDate))
      .groupBy(achievements.id, achievements.title)
      .orderBy(desc(sql`count(${user_achievements.user_id})`))
      .limit(10),

    // 10. Enrollment Trends trong khoảng thời gian đã chọn
    db.select({
      date: sql<string>`to_char(${enrollments.enrolled_at}, 'YYYY-MM-DD')`,
      enrollments: sql<number>`cast(count(*) as int)`,
      completions: sql<number>`cast(sum(case when ${enrollments.status} = 'COMPLETED' then 1 else 0 end) as int)`,
    })
      .from(enrollments)
      .where(gte(enrollments.enrolled_at, startDate))
      .groupBy(sql`to_char(${enrollments.enrolled_at}, 'YYYY-MM-DD')`),
  ]);

  const totalUsers = totalUsersResult[0]?.count ?? 0;
  const publishedCourses = publishedCoursesResult[0]?.count ?? 0;
  const flashcardSets = flashcardSetsResult[0]?.count ?? 0;
  const lessonsCompleted = lessonsCompletedResult[0]?.count ?? 0;
  const badgesAwarded = badgesAwardedResult[0]?.count ?? 0;

  const stats = [
    { label: 'New Users', value: totalUsers.toLocaleString(), icon: 'users', color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Courses Created', value: publishedCourses.toLocaleString(), icon: 'book-open', color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Flashcard Sets', value: flashcardSets.toLocaleString(), icon: 'layers', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Achievements Awarded', value: badgesAwarded.toLocaleString(), icon: 'trophy', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Lessons Completed', value: lessonsCompleted.toLocaleString(), icon: 'target', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  // Zero-fill Active Users
  const dailyActiveUsers = buckets.map(bucket => {
    const matching = dauResult.filter(r => matchDateToBucket(r.date, bucket, granularity));
    const userCount = matching.reduce((sum, r) => sum + Number(r.users || 0), 0);
    return { day: bucket.label, users: userCount };
  });

  // Zero-fill Weekly Lessons
  const weeklyLessons = buckets.map(bucket => {
    const matching = weeklyLessonsResult.filter(r => matchDateToBucket(r.date, bucket, granularity));
    const count = matching.reduce((sum, r) => sum + Number(r.count || 0), 0);
    return { day: bucket.label, count };
  });

  const topCourses = topCoursesResult.map((c) => ({
    name: c.name,
    enrollments: c.enrollments,
    completionRate: Number(((c.completions / (c.enrollments || 1)) * 100).toFixed(1)),
    rating: c.rating ?? '0',
  }));

  const topAchievements = topAchievementsResult.map(b => ({
    name: b.name,
    iconName: b.iconName ?? 'Trophy',
    themeColor: b.themeColor ?? 'gray',
    awarded: b.awarded,
  }));

  // Zero-fill Enrollment Trends
  const enrollmentTrends = buckets.map(bucket => {
    const matching = enrollmentTrendsResult.filter(r => matchDateToBucket(r.date, bucket, granularity));
    const enrollmentsCount = matching.reduce((sum, r) => sum + Number(r.enrollments || 0), 0);
    const completionsCount = matching.reduce((sum, r) => sum + Number(r.completions || 0), 0);

    return {
      month: bucket.label,
      enrollments: enrollmentsCount,
      completions: completionsCount,
    };
  });

  return { stats, dailyActiveUsers, weeklyLessons, topCourses, topAchievements, enrollmentTrends };
}