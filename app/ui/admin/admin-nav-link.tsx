'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { AdminNavItem } from './admin-nav-items';

interface AdminNavLinkProps {
  item: AdminNavItem;
  isActive: boolean;
  onClick?: () => void;
}

export default function AdminNavLink({ item, isActive, onClick }: AdminNavLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.path}
      onClick={onClick}
      className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group"
    >
      <div
        className={`flex items-center gap-3 w-full ${
          isActive
            ? 'text-indigo-700 font-semibold'
            : 'text-slate-600 group-hover:text-indigo-600'
        }`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <span className="text-sm">{item.label}</span>
      </div>

      {isActive && (
        <motion.div
          layoutId="admin-active-nav"
          className="absolute inset-0 bg-indigo-50/80 border border-indigo-100 rounded-xl -z-10"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
}
