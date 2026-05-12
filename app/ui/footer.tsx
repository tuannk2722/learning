'use client';
import { BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname === '/onboarding') return null;
  return (
    <footer className="py-12 px-6 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto text-center text-gray-600">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Gamified Learning</span>
        </div>
        <p className="text-sm">© 2026 Gamified Learning. Transform learning into an adventure.</p>
      </div>
    </footer>
  )
}