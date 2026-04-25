'use client';

import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { User, Menu, X } from 'lucide-react';
import Logo from '@/app/ui/logo';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';

export default function SideNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (pathname === '/onboarding') return null;

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-violet-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div onClick={() => setIsOpen(false)} className="cursor-pointer">
          <Logo href="/dashboard" />
        </div>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          <NavLinks setIsOpen={setIsOpen} type={'desktop'} />
        </div>

        {/* Desktop Profile (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/dashboard/profile"
            className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold hover:shadow-lg hover:ring-2 hover:ring-violet-200 transition-all hover:scale-105"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden p-2 -mr-2 text-violet-600 hover:text-violet-800 transition-colors focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-violet-100 overflow-hidden shadow-xl"
          >
            <div className="px-6 py-6 flex flex-col gap-6">

              {/* Menu Links */}
              <NavLinks setIsOpen={setIsOpen} type={'mobile'} />

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
