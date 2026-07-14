'use client';

import { createContext, useContext, useTransition, ReactNode } from 'react';
import { handleLogout } from '@/app/lib/actions/auth';

interface LogoutContextValue {
  isLoggingOut: boolean;
  triggerLogout: () => void;
}

const LogoutContext = createContext<LogoutContextValue>({
  isLoggingOut: false,
  triggerLogout: () => { },
});

export function useLogout() {
  return useContext(LogoutContext);
}

export function LogoutProvider({ children }: { children: ReactNode }) {
  const [isLoggingOut, startTransition] = useTransition();

  const triggerLogout = () => {
    startTransition(async () => {
      await handleLogout();
    });
  };

  return (
    <LogoutContext.Provider value={{ isLoggingOut, triggerLogout }}>
      {/* Full-page overlay khi đang logout */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9998] bg-white/10 backdrop-blur-sm cursor-not-allowed" />
      )}
      {children}
    </LogoutContext.Provider>
  );
}
