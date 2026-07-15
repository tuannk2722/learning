import {
  BookOpen, Trophy, Target, User, LogIn, UserPlus,
  Settings, Star, CheckCircle, Trash2, Eye, EyeOff, PenLine,
} from "lucide-react";
import type { ActivityAction } from "@/app/lib/definitions/activity-log";
import { ACTION_LABELS, ACTION_COLORS } from "@/app/lib/definitions/activity-log";
import type { ActivityLogWithUser } from "@/app/lib/definitions/activity-log";

const ACTION_ICONS: Record<ActivityAction, React.ElementType> = {
  USER_REGISTER: UserPlus,
  USER_LOGIN: LogIn,
  COMPLETE_ONBOARDING: CheckCircle,
  UPDATE_PROFILE: Settings,
  ENROLL_COURSE: BookOpen,
  COMPLETE_LESSON: BookOpen,
  COMPLETE_QUIZ: Star,
  UNLOCK_ACHIEVEMENT: Trophy,
  COMPLETE_QUEST: Target,
  CREATE_COURSE: PenLine,
  UPDATE_COURSE: PenLine,
  PUBLISH_COURSE: Eye,
  UNPUBLISH_COURSE: EyeOff,
  DELETE_COURSE: Trash2,
  PUBLISH_LESSON: Eye,
  UNPUBLISH_LESSON: EyeOff,
};

function formatTimestamp(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(date));
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

interface ActivityLogItemProps {
  log: ActivityLogWithUser;
  index: number;
}

export default function ActivityLogItem({ log }: ActivityLogItemProps) {
  const action = log.action as ActivityAction;
  const Icon = ACTION_ICONS[action] ?? BookOpen;
  const colors = ACTION_COLORS[action] ?? {
    bg: "bg-gray-100",
    text: "text-gray-700",
    badge: "bg-gray-100 text-gray-700",
  };
  const label = ACTION_LABELS[action] ?? action;

  const metaData = log.metadata as Record<string, unknown> | null;

  return (
    <div className="flex items-start gap-4 p-5 hover:bg-slate-50/60 transition-colors group">
      {/* Action icon */}
      <div
        className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
      >
        <Icon className={`w-5 h-5 ${colors.text}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            {/* User info */}
            <div className="flex items-center gap-2 mb-1">
              {log.user_avatar ? (
                <img
                  src={log.user_avatar}
                  alt={log.user_name ?? ""}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-indigo-700">
                    {getInitials(log.user_name)}
                  </span>
                </div>
              )}
              <span className="text-sm font-semibold text-indigo-600">
                {log.user_name ?? "Anonymous user"}
              </span>
              {log.user_email && (
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  ({log.user_email})
                </span>
              )}
            </div>

            {/* Action description */}
            <p className="text-sm text-slate-700">
              <span className="font-medium">{label}</span>
              {log.entity_name && (
                <span className="text-slate-500"> — {log.entity_name}</span>
              )}
            </p>

            {/* Extra metadata */}
            {metaData && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {typeof metaData.xpEarned === "number" && metaData.xpEarned > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                    +{metaData.xpEarned} XP
                  </span>
                )}
                {typeof metaData.reward_xp === "number" && metaData.reward_xp > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                    +{metaData.reward_xp} XP
                  </span>
                )}
                {typeof metaData.score === "number" && typeof metaData.total === "number" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                    {metaData.score}/{metaData.total} questions
                  </span>
                )}
                {typeof metaData.passed === "boolean" && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${metaData.passed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {metaData.passed ? "Passed" : "Failed"}
                  </span>
                )}
                {typeof metaData.provider === "string" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    via {metaData.provider}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Timestamp + badge */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <time className="text-xs text-muted-foreground whitespace-nowrap">
              {formatTimestamp(log.created_at)}
            </time>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
              {log.entity_type ?? "system"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
