'use client';

import { usePathname } from 'next/navigation';
import SideNav from './dashboard/sidenav';
import OnboardingNav from './onboarding/onboarding-nav';

interface ConditionalNavProps {
  avatarUrl?: string | null;
  userName?: string | null;
  currentStreak?: number;
  isAdmin?: boolean;
}

export default function ConditionalNav({ avatarUrl, userName, currentStreak = 0, isAdmin = false }: ConditionalNavProps) {
  const pathname = usePathname();

  if (pathname === '/onboarding') {
    return <OnboardingNav />;
  }

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
