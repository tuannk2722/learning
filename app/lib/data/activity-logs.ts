import { db } from "../db";
import { activity_logs, users } from "../db/schema";
import { desc, eq, ilike, and, gte, sql, count } from "drizzle-orm";
import type { ActivityLogWithUser, ActivityLogFilter } from "../definitions/activity-log";

const PAGE_SIZE = 20;

function getDateCutoff(dateRange?: string): Date | null {
  const now = new Date();
  if (dateRange === "today") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (dateRange === "7days") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }
  if (dateRange === "30days") {
    const d = new Date(now);
    d.setDate(d.getDate() - 30);
    return d;
  }
  return null;
}

export async function getActivityLogs(
  filter: ActivityLogFilter = {}
): Promise<{ logs: ActivityLogWithUser[]; total: number; totalPages: number }> {
  try {
    const {
      userSearch,
      actionType,
      dateRange,
      page = 1,
      pageSize = PAGE_SIZE,
    } = filter;

    const offset = (page - 1) * pageSize;
    const cutoff = getDateCutoff(dateRange);

    // Build WHERE conditions
    const conditions = [];

    if (actionType && actionType !== "all") {
      conditions.push(eq(activity_logs.action, actionType));
    }

    if (cutoff) {
      conditions.push(gte(activity_logs.created_at, cutoff));
    }

    // Base query with LEFT JOIN to users
    const baseQuery = db
      .select({
        id: activity_logs.id,
        user_id: activity_logs.user_id,
        action: activity_logs.action,
        entity_type: activity_logs.entity_type,
        entity_id: activity_logs.entity_id,
        entity_name: activity_logs.entity_name,
        metadata: activity_logs.metadata,
        created_at: activity_logs.created_at,
        user_name: users.name,
        user_avatar: users.avatar_url,
        user_email: users.email,
      })
      .from(activity_logs)
      .leftJoin(users, eq(activity_logs.user_id, users.id));

    // Add user search filter (after join) - hỗ trợ tìm kiếm không dấu
    if (userSearch && userSearch.trim() !== "") {
      const searchPattern = `%${userSearch.trim()}%`;
      conditions.push(sql`unaccent(${users.name}) ILIKE unaccent(${searchPattern})`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [logsResult, countResult] = await Promise.all([
      (whereClause ? baseQuery.where(whereClause) : baseQuery)
        .orderBy(desc(activity_logs.created_at))
        .limit(pageSize)
        .offset(offset),

      db
        .select({ total: count() })
        .from(activity_logs)
        .leftJoin(users, eq(activity_logs.user_id, users.id))
        .where(whereClause ?? sql`1=1`),
    ]);

    const total = Number(countResult[0]?.total ?? 0);
    const totalPages = Math.ceil(total / pageSize);

    return {
      logs: logsResult as ActivityLogWithUser[],
      total,
      totalPages,
    };
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);
    return { logs: [], total: 0, totalPages: 0 };
  }
}

export async function getActivityLogStats(): Promise<{
  todayCount: number;
  weekCount: number;
  monthCount: number;
  totalCount: number;
}> {
  try {
    const now = new Date();

    const todayCutoff = new Date(now);
    todayCutoff.setHours(0, 0, 0, 0);

    const weekCutoff = new Date(now);
    weekCutoff.setDate(weekCutoff.getDate() - 7);

    const monthCutoff = new Date(now);
    monthCutoff.setDate(monthCutoff.getDate() - 30);

    const [todayResult, weekResult, monthResult, totalResult] = await Promise.all([
      db.select({ c: count() }).from(activity_logs).where(gte(activity_logs.created_at, todayCutoff)),
      db.select({ c: count() }).from(activity_logs).where(gte(activity_logs.created_at, weekCutoff)),
      db.select({ c: count() }).from(activity_logs).where(gte(activity_logs.created_at, monthCutoff)),
      db.select({ c: count() }).from(activity_logs),
    ]);

    return {
      todayCount: Number(todayResult[0]?.c ?? 0),
      weekCount: Number(weekResult[0]?.c ?? 0),
      monthCount: Number(monthResult[0]?.c ?? 0),
      totalCount: Number(totalResult[0]?.c ?? 0),
    };
  } catch (error) {
    console.error("Failed to fetch activity log stats:", error);
    return { todayCount: 0, weekCount: 0, monthCount: 0, totalCount: 0 };
  }
}
