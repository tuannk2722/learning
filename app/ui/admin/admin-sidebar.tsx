'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from '@/app/ui/logo';
import AdminNavLink from './admin-nav-link';
import { adminNavItems, userViewItem } from './admin-nav-items';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close mobile sidebar on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileOpen]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-violet-100">
        <Logo href="/admin" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu
        </p>
        {adminNavItems.map((item) => (
          <AdminNavLink
            key={item.path}
            item={item}
            isActive={pathname === item.path}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {/* Bottom Section — User View + Profile */}
      <div className="border-t border-violet-100 px-3 py-4 space-y-2">
        {/* User View link */}
        <AdminNavLink
          item={userViewItem}
          isActive={false}
          onClick={() => setMobileOpen(false)}
        />

      </div>
    </div>
  );

  return (
    <>
      {/* ───── Mobile Top Bar ───── */}
      <div className="md:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-violet-100 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <Logo href="/admin" />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 -mr-2 text-violet-600 hover:text-violet-800 transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ───── Mobile Overlay ───── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Sliding sidebar */}
            <motion.div
              ref={sidebarRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
              className="md:hidden fixed top-0 left-0 z-50 w-72 h-full bg-white border-r border-violet-100 shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ───── Desktop Sidebar ───── */}
      <aside className="hidden md:flex fixed top-0 left-0 z-40 w-64 h-screen bg-white/95 backdrop-blur-md border-r border-violet-100 shadow-sm flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}
