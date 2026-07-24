'use client';

import { Search, RefreshCw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

export default function FlashcardFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local mirror of URL params for controlled inputs
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");

  const pushParams = useCallback(
    (newQ: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = newQ.trim();
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      startTransition(() => {
        router.replace(url);
      });
    },
    [pathname, router, searchParams]
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    pushParams(searchValue);
  };

  const handleReset = () => {
    setSearchValue("");
    pushParams("");
  };

  const hasQuery = Boolean(searchValue.trim() || searchParams.get("q"));

  return (
    <div className={`mb-6 transition-opacity ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      <div className="flex items-center gap-2.5 sm:gap-3 max-w-lg">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 min-w-0 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search flashcards... (Press Enter)"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 shadow-sm hover:border-gray-300 transition-all"
          />
        </form>

        {/* Reset Button (Hiển thị khi có query) */}
        {hasQuery && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${isPending ? "animate-spin text-violet-600" : ""}`} />
            <span className="text-sm font-medium">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
