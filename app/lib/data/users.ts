import { db } from "../db";
import {
  users,
  user_lesson_progress,
  lessons,
  courses,
  enrollments,
  sections,
  quiz_attempts,
  activity_logs
} from "../db/schema";
import { eq, desc, sql, and, notInArray, isNull, isNotNull, count } from "drizzle-orm";
import type { User, UserInfoLogin } from "../definitions/user";
import type { LeaderboardEntry } from "../definitions/definitions";
import { calculateLevel } from "../utils/xp";
import { ADMIN_EMAILS } from "../../../auth.config";
import { formatLastActive } from "../utils/active-status";
import { getAchievements } from "./achievements";

export async function getAllUsers(): Promise<User[]> {
  try {
    const allUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.last_study_date));

    return allUsers as User[];
  } catch (error) {
    console.error('Failed to fetch all users:', error);
    throw new Error('Failed to fetch all users.');
  }
}

export async function getFilteredUsers(filter: {
  searchQuery?: string;
  status?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<{ users: User[]; total: number; totalPages: number }> {
  try {
    const { searchQuery, status, page = 1, pageSize = 10 } = filter;
    const offset = (page - 1) * pageSize;

    const conditions = [];

    if (status === 'active') {
      conditions.push(isNotNull(users.last_study_date));
    } else if (status === 'inactive') {
      conditions.push(isNull(users.last_study_date));
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const searchPattern = `%${searchQuery.trim()}%`;
      conditions.push(
        sql`(unaccent(${users.name}) ILIKE unaccent(${searchPattern}) OR unaccent(${users.email}) ILIKE unaccent(${searchPattern}))`
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [usersResult, countResult] = await Promise.all([
      db
        .select()
        .from(users)
        .where(whereClause ?? sql`1=1`)
        .orderBy(desc(users.last_study_date))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ total: count() })
        .from(users)
        .where(whereClause ?? sql`1=1`),
    ]);

    const total = Number(countResult[0]?.total ?? 0);
    const totalPages = Math.ceil(total / pageSize);

    return {
      users: usersResult as User[],
      total,
      totalPages,
    };
  } catch (error) {
    console.error('Failed to fetch filtered users:', error);
    throw new Error('Failed to fetch filtered users.');
  }
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        location: users.location,
        bio: users.bio,
        total_xp: users.total_xp,
        current_streak: users.current_streak,
        longest_streak: users.longest_streak,
        last_study_date: users.last_study_date,
        is_onboarded: users.is_onboarded,
        avatar_url: users.avatar_url,
        created_at: users.created_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (user.length === 0) return undefined;

    return {
      ...user[0],
      is_onboarded: user[0].is_onboarded ?? false,
    } as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getUserByEmail(email: string): Promise<UserInfoLogin | undefined> {
  try {
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (user.length === 0) return undefined;

    return {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      password_hash: user[0].password_hash,
      is_onboarded: user[0].is_onboarded ?? false,
    } as UserInfoLogin;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getLeaderboardData(currentUserId?: string): Promise<LeaderboardEntry[]> {
  try {
    const allUsers = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.is_onboarded, true),
          notInArray(users.email, ADMIN_EMAILS)
        )
      )
      .orderBy(desc(users.total_xp));

    return allUsers.map((user, index) => {
      const levelObj = calculateLevel(user.total_xp || 0);

      const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'U';

      return {
        rank: index + 1,
        name: user.name,
        level: levelObj.level,
        xp: user.total_xp || 0,
        streak: user.current_streak || 0,
        isCurrentUser: currentUserId ? user.id === currentUserId : false,
        avatar: user.avatar_url || initials,
      };
    });
  } catch (error) {
    console.error('Failed to fetch leaderboard data:', error);
    throw new Error('Failed to fetch leaderboard data.');
  }
}

export async function getRankByUserId(userId: string): Promise<number> {
  try {
    const userResult = await db.select({ xp: users.total_xp }).from(users).where(eq(users.id, userId)).limit(1);
    if (!userResult.length) return 0;

    const userXp = userResult[0].xp || 0;

    const countResult = await db.select({ count: sql<number>`cast(count(*) as integer)` })
      .from(users)
      .where(sql`${users.total_xp} > ${userXp} AND ${users.is_onboarded} = true`);

    return Number(countResult[0].count) + 1;
  } catch (error) {
    console.error('Failed to get rank:', error);
    return 0;
  }
}

export async function getTop1User() {
  try {
    const topUsers = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.is_onboarded, true),
          notInArray(users.email, ADMIN_EMAILS)
        )
      )
      .orderBy(desc(users.total_xp))
      .limit(1);
    if (!topUsers.length) return null;

    const user = topUsers[0];

    const lessonsResult = await db
      .select({
        count: sql<number>`count(*)`,
        minutes: sql<number>`sum(${lessons.duration_minutes})`
      })
      .from(user_lesson_progress)
      .innerJoin(lessons, eq(user_lesson_progress.lesson_id, lessons.id))
      .where(and(
        eq(user_lesson_progress.user_id, user.id),
        eq(user_lesson_progress.status, 'completed')
      ));

    const lessonsCompleted = Number(lessonsResult[0]?.count) || 0;
    const studyHours = Math.round((Number(lessonsResult[0]?.minutes) || 0) / 60);
    const levelObj = calculateLevel(user.total_xp || 0);
    const initials = user.name
      ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : 'U';

    return {
      avatar: user.avatar_url || initials,
      name: user.name,
      level: levelObj.level,
      total_xp: user.total_xp || 0,
      longest_streak: user.longest_streak || 0,
      current_streak: user.current_streak || 0,
      total_study_time: studyHours,
      lesson_completed: lessonsCompleted,
      level_progress: levelObj.progress,
    };
  } catch (error) {
    console.error('Failed to get top 1 user:', error);
    return null;
  }
}

export async function getUserDetailsForModal(userId: string) {
  try {
    // 1. Fetch user info
    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userRows.length === 0) return null;
    const rawUser = userRows[0];
    const levelObj = calculateLevel(rawUser.total_xp || 0);

    // 2. Fetch enrolled courses stats
    const courseStats = await db
      .select({
        courseId: courses.id,
        name: courses.name,
        status: enrollments.status,
        progressPercent: enrollments.progress_percent,
        totalLessons: sql<number>`cast(count(distinct ${lessons.id}) as int)`,
        completedLessons: sql<number>`cast(count(distinct case when ${user_lesson_progress.status} = 'completed' then ${lessons.id} else null end) as int)`
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.course_id, courses.id))
      .leftJoin(sections, eq(courses.id, sections.course_id))
      .leftJoin(lessons, eq(sections.id, lessons.section_id))
      .leftJoin(user_lesson_progress, and(
        eq(lessons.id, user_lesson_progress.lesson_id),
        eq(user_lesson_progress.user_id, userId)
      ))
      .where(eq(enrollments.user_id, userId))
      .groupBy(courses.id, enrollments.status, enrollments.progress_percent);

    const enrolledCourses = courseStats.map((c) => {
      const total = c.totalLessons || 0;
      const completed = c.completedLessons || 0;
      const progress = total > 0 ? Math.round((completed / total) * 100) : (c.progressPercent || 0);
      const isCompleted = (completed === total && total > 0) || c.status === 'COMPLETED';

      return {
        name: c.name,
        progress,
        lessons: `${completed}/${total}`,
        status: isCompleted ? "Completed" : "In Progress",
      };
    });

    // 3. Fetch recent activity
    const activityRows = await db
      .select()
      .from(activity_logs)
      .where(eq(activity_logs.user_id, userId))
      .orderBy(desc(activity_logs.created_at))
      .limit(5);

    const recentActivities = activityRows.map((act) => {
      let icon = "Zap";
      let color = "orange";
      let actionLabel = act.action.replace(/_/g, " ").toLowerCase();
      actionLabel = actionLabel.charAt(0).toUpperCase() + actionLabel.slice(1);

      if (act.action === "COMPLETE_LESSON") {
        icon = "CheckCircle";
        color = "emerald";
        actionLabel = "Completed lesson";
      } else if (act.action === "UNLOCK_ACHIEVEMENT") {
        icon = "Award";
        color = "yellow";
        actionLabel = "Earned achievement";
      } else if (act.action === "ENROLL_COURSE") {
        icon = "BookOpen";
        color = "blue";
        actionLabel = "Started course";
      } else if (act.action === "COMPLETE_QUIZ") {
        icon = "Trophy";
        color = "purple";
        actionLabel = "Completed quiz";
      }

      let item = act.entity_name || "";
      if (act.action === "COMPLETE_QUIZ" && act.metadata) {
        const meta = act.metadata as Record<string, unknown>;
        if (meta && typeof meta.score === "number") {
          item += ` - ${meta.score}%`;
        }
      }

      return {
        action: actionLabel,
        item,
        time: formatLastActive(act.created_at),
        icon,
        color,
      };
    });

    // 4. Fetch achievements using existing helper
    const achievementList = await getAchievements(userId);
    const achievementsMapped = achievementList.map((ach) => ({
      name: ach.title,
      desc: ach.description,
      icon: ach.icon,
      unlocked: ach.unlocked,
      themeColor: ach.theme_color,
    }));

    // 5. Fetch study time
    const studyTimeResult = await db
      .select({
        completedAt: user_lesson_progress.completed_at,
        duration: lessons.duration_minutes
      })
      .from(user_lesson_progress)
      .innerJoin(lessons, eq(user_lesson_progress.lesson_id, lessons.id))
      .where(and(
        eq(user_lesson_progress.user_id, userId),
        eq(user_lesson_progress.status, 'completed')
      ));

    const allTimeMinutes = studyTimeResult.reduce((sum, row) => sum + (row.duration || 0), 0);
    const nowMs = new Date().getTime();

    const thisWeekMinutes = studyTimeResult
      .filter(row => row.completedAt && (nowMs - new Date(row.completedAt).getTime() <= 7 * 24 * 60 * 60 * 1000))
      .reduce((sum, row) => sum + (row.duration || 0), 0);

    const thisMonthMinutes = studyTimeResult
      .filter(row => row.completedAt && (nowMs - new Date(row.completedAt).getTime() <= 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, row) => sum + (row.duration || 0), 0);

    const activeDays = new Set(
      studyTimeResult
        .map(row => row.completedAt ? new Date(row.completedAt).toDateString() : null)
        .filter(Boolean)
    ).size;
    const dailyAverageMinutes = activeDays > 0 ? Math.round(allTimeMinutes / activeDays) : 0;

    const formatMinutes = (m: number) => {
      const hours = Math.floor(m / 60);
      const mins = m % 60;
      if (hours > 0) {
        return `${hours}h ${mins}m`;
      }
      return `${mins}m`;
    };

    const studyTime = {
      thisWeek: formatMinutes(thisWeekMinutes),
      thisMonth: formatMinutes(thisMonthMinutes),
      allTime: formatMinutes(allTimeMinutes),
      dailyAverage: formatMinutes(dailyAverageMinutes),
    };

    // 6. Performance stats (Quiz average & participation)
    const quizAttempts = await db
      .select({
        score: quiz_attempts.score,
        total: quiz_attempts.total
      })
      .from(quiz_attempts)
      .where(eq(quiz_attempts.user_id, userId));

    let quizAverage = 0;
    if (quizAttempts.length > 0) {
      const totalPercent = quizAttempts.reduce((sum, q) => sum + (q.score / q.total), 0);
      quizAverage = Math.round((totalPercent / quizAttempts.length) * 100);
    }

    const totalEnrolledLessons = courseStats.reduce((sum, c) => sum + (c.totalLessons || 0), 0);
    const completedEnrolledLessons = courseStats.reduce((sum, c) => sum + (c.completedLessons || 0), 0);
    const participation = totalEnrolledLessons > 0
      ? Math.round((completedEnrolledLessons / totalEnrolledLessons) * 100)
      : 0;

    const joinedDate = rawUser.created_at
      ? new Date(rawUser.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : "N/A";

    const lastActive = rawUser.last_study_date
      ? formatLastActive(rawUser.last_study_date)
      : "InActive";

    return {
      user: {
        id: rawUser.id,
        name: rawUser.name,
        email: rawUser.email,
        avatarUrl: rawUser.avatar_url,
        level: levelObj.level,
        totalXp: rawUser.total_xp || 0,
        streak: rawUser.current_streak || 0,
        joinedDate,
        lastActive,
      },
      enrolledCourses,
      recentActivities,
      achievements: achievementsMapped,
      studyTime,
      performance: {
        quizAverage,
        participation,
      }
    };
  } catch (error) {
    console.error("Error getting user details for modal:", error);
    return null;
  }
}