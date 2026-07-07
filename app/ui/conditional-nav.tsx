'use client';

import { usePathname } from 'next/navigation';
import SideNav from './dashboard/sidenav';

interface ConditionalNavProps {
  avatarUrl?: string | null;
  userName?: string | null;
  currentStreak?: number;
  isAdmin?: boolean;
}

/**
 * Renders the user top navbar only when NOT on admin routes.
 * Admin routes have their own sidebar via AdminSidebar.
 */
export default function ConditionalNav({ avatarUrl, userName, currentStreak = 0, isAdmin = false }: ConditionalNavProps) {
  const pathname = usePathname();

  // Don't render user navbar on admin pages — admin has its own sidebar
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <SideNav
      avatarUrl={avatarUrl}
      userName={userName}
      currentStreak={currentStreak}
      isAdmin={isAdmin}
    />
  );
}
