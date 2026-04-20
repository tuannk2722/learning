'use client';

import { Home, BarChart3, BookOpen, Crown, Flame, User } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/dashboard/courses', icon: BookOpen, label: 'Courses' },
  { path: '/dashboard/achievements', icon: Flame, label: 'Achievements' },
  { path: '/dashboard/leaderboard', icon: Crown, label: 'Leaderboard' },
  { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
];

interface Props {
  type: 'desktop' | 'mobile';
  setIsOpen?: (value: boolean) => void;
}

export default function NavLinks({ type, setIsOpen }: Props) {
  const pathname = usePathname();
  const isMobile = type === 'mobile';

  const handleLinkClick = () => {
    if (isMobile && setIsOpen) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className={isMobile ? "flex flex-col gap-2" : "flex items-center gap-2"}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={handleLinkClick}
              className={`relative px-4 py-2.5 rounded-xl transition-colors ${isMobile ? 'w-full' : ''
                }`}
            >
              <div className={`flex items-center gap-2 ${isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>
                <Icon className="w-5 h-5" />
                <span className="text-sm font-semibold">{item.label}</span>
              </div>

              {isActive && (
                <motion.div
                  layoutId={`activeNav-${type}`}
                  className="absolute inset-0 bg-indigo-50/80 rounded-xl -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {isMobile && (
        <>
          <div className="h-px bg-violet-100" />
          <Link
            href="/dashboard/profile"
            onClick={handleLinkClick}
            className="flex items-center justify-center gap-3 w-full py-3.5 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded-xl font-semibold transition-colors"
          >
            <User className="w-5 h-5" />
            <span>My Profile</span>
          </Link>
        </>
      )}
    </>
  );
}
