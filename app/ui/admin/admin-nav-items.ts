import { LayoutDashboard, BookOpen, Users, Activity, User } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface AdminNavItem {
  path: string;
  icon: LucideIcon;
  label: string;
}

export const adminNavItems: AdminNavItem[] = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/courses", icon: BookOpen, label: "Course Management" },
  { path: "/admin/user-management", icon: Users, label: "User Management" },
  { path: "/admin/activitylog", icon: Activity, label: "Activity Log" },
];

export const userViewItem: AdminNavItem = {
  path: '/dashboard',
  icon: User,
  label: 'User View',
};
