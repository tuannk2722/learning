"use server";

import { db } from "../db";
import { activity_logs } from "../db/schema";
import { lt } from "drizzle-orm";
import type { ActivityAction, ActivityEntityType } from "../definitions/activity-log";

interface LogActivityParams {
  userId?: string | null;
  action: ActivityAction;
  entityType?: ActivityEntityType;
  entityId?: number;
  entityName?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Ghi một activity log vào database.
 * Fire-and-forget: không throw error để không block main flow.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    await db.insert(activity_logs).values({
      user_id: params.userId ?? null,
      action: params.action,
      entity_type: params.entityType ?? null,
      entity_id: params.entityId ?? null,
      entity_name: params.entityName ?? null,
      metadata: params.metadata ?? null,
      created_at: new Date(),
    });
  } catch (error) {
    // Không throw: logging không được làm hỏng flow chính
    console.error("[ActivityLog] Failed to write log:", error);
  }
}

/**
 * Xóa các activity logs cũ hơn 90 ngày.
 * Nên được gọi định kỳ (có thể từ cron job hoặc thủ công).
 */
export async function pruneOldActivityLogs(): Promise<{ deleted: number }> {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);

    const result = await db
      .delete(activity_logs)
      .where(lt(activity_logs.created_at, cutoff))
      .returning({ id: activity_logs.id });

    return { deleted: result.length };
  } catch (error) {
    console.error("[ActivityLog] Failed to prune old logs:", error);
    return { deleted: 0 };
  }
}
