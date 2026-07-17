export type ActivityAction =
  // User actions
  | "USER_REGISTER"
  | "USER_LOGIN"
  | "COMPLETE_ONBOARDING"
  | "UPDATE_PROFILE"
  | "RATE_COURSE"
  // Course actions (user)
  | "ENROLL_COURSE"
  // Lesson actions (user)
  | "COMPLETE_LESSON"
  // Quiz actions
  | "COMPLETE_QUIZ"
  // Achievement actions
  | "UNLOCK_ACHIEVEMENT"
  // Quest actions
  | "COMPLETE_QUEST"
  // Admin actions
  | "CREATE_COURSE"
  | "UPDATE_COURSE"
  | "PUBLISH_COURSE"
  | "UNPUBLISH_COURSE"
  | "DELETE_COURSE"
  | "PUBLISH_LESSON"
  | "UNPUBLISH_LESSON";

export type ActivityEntityType =
  | "course"
  | "lesson"
  | "quiz"
  | "achievement"
  | "quest"
  | "user"
  | "system";

export interface ActivityLog {
  id: number;
  user_id: string | null;
  action: ActivityAction;
  entity_type: string | null;
  entity_id: number | null;
  entity_name: string | null;
  metadata: Record<string, unknown> | null;
  created_at: Date | null;
}

export interface ActivityLogWithUser extends ActivityLog {
  user_name: string | null;
  user_avatar: string | null;
  user_email: string | null;
}

export interface ActivityLogFilter {
  userSearch?: string;
  actionType?: string;
  dateRange?: "today" | "7days" | "30days" | "all";
  page?: number;
  pageSize?: number;
}

export const ACTION_LABELS: Record<ActivityAction, string> = {
  USER_REGISTER: "Register account",
  USER_LOGIN: "Login",
  COMPLETE_ONBOARDING: "Complete onboarding",
  UPDATE_PROFILE: "Update profile",
  ENROLL_COURSE: "Enroll course",
  RATE_COURSE: "Rate course",
  COMPLETE_LESSON: "Complete lesson",
  COMPLETE_QUIZ: "Complete quiz",
  UNLOCK_ACHIEVEMENT: "Unlock achievement",
  COMPLETE_QUEST: "Complete quest",
  CREATE_COURSE: "Create course",
  UPDATE_COURSE: "Update course",
  PUBLISH_COURSE: "Publish course",
  UNPUBLISH_COURSE: "Unpublish course",
  DELETE_COURSE: "Delete course",
  PUBLISH_LESSON: "Publish lesson",
  UNPUBLISH_LESSON: "Unpublish lesson",
};

export const ACTION_COLORS: Record<
  ActivityAction,
  { bg: string; text: string; badge: string }
> = {
  USER_REGISTER: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
  },
  USER_LOGIN: {
    bg: "bg-sky-100",
    text: "text-sky-700",
    badge: "bg-sky-100 text-sky-700",
  },
  COMPLETE_ONBOARDING: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    badge: "bg-violet-100 text-violet-700",
  },
  UPDATE_PROFILE: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    badge: "bg-slate-100 text-slate-700",
  },
  ENROLL_COURSE: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    badge: "bg-purple-100 text-purple-700",
  },
  RATE_COURSE: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    badge: "bg-purple-100 text-purple-700",
  },
  COMPLETE_LESSON: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700",
  },
  COMPLETE_QUIZ: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    badge: "bg-indigo-100 text-indigo-700",
  },
  UNLOCK_ACHIEVEMENT: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    badge: "bg-yellow-100 text-yellow-700",
  },
  COMPLETE_QUEST: {
    bg: "bg-green-100",
    text: "text-green-700",
    badge: "bg-green-100 text-green-700",
  },
  CREATE_COURSE: {
    bg: "bg-teal-100",
    text: "text-teal-700",
    badge: "bg-teal-100 text-teal-700",
  },
  UPDATE_COURSE: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    badge: "bg-orange-100 text-orange-700",
  },
  PUBLISH_COURSE: {
    bg: "bg-green-100",
    text: "text-green-700",
    badge: "bg-green-100 text-green-700",
  },
  UNPUBLISH_COURSE: {
    bg: "bg-rose-100",
    text: "text-rose-700",
    badge: "bg-rose-100 text-rose-700",
  },
  DELETE_COURSE: {
    bg: "bg-red-100",
    text: "text-red-700",
    badge: "bg-red-100 text-red-700",
  },
  PUBLISH_LESSON: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    badge: "bg-cyan-100 text-cyan-700",
  },
  UNPUBLISH_LESSON: {
    bg: "bg-rose-100",
    text: "text-rose-700",
    badge: "bg-rose-100 text-rose-700",
  },
};
