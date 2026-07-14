'use client';

import Logo from '@/app/ui/logo';
import { handleLogout } from '@/app/lib/actions/auth';
import { LogOut, Loader2 } from 'lucide-react';
import { useTransition } from 'react';

export default function OnboardingNav() {
  const [isPending, startTransition] = useTransition();

  const handleLogoutClick = () => {
    startTransition(async () => {
      await handleLogout();
    });
  };

  return (
    <>
      {/* Full-page overlay: blocks all clicks on the wizard while logging out */}
      {isPending && (
        <div className="fixed inset-0 z-[9998] bg-white/50 backdrop-blur-sm cursor-not-allowed" />
      )}

      <nav className="sticky top-0 z-[9999] bg-white/90 backdrop-blur-md border-b border-violet-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Logo href="/" />

          {/* Sign out button */}
          <button
            type="button"
            onClick={handleLogoutClick}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group
              disabled:opacity-10 disabled:cursor-not-allowed
              text-slate-600 hover:text-violet-700 hover:bg-violet-50
              disabled:hover:text-slate-600 disabled:hover:bg-transparent"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            )}
            <span>{isPending ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
