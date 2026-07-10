'use client';

import { Search, Grid3x3, List } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

interface FlashcardFilterProps {
  allTags: string[];
}

export default function FlashcardFilter({ allTags }: FlashcardFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local mirror of URL params for controlled inputs
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");

  const currentTag = searchParams.get("tag") ?? "all";
  const currentView = (searchParams.get("view") ?? "grid") as "grid" | "list";

  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "grid") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, pathname, router]
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    pushParams({ q: searchValue });
  };

  const handleTagClick = (tag: string) => {
    pushParams({ tag: tag === currentTag ? "all" : tag });
  };

  const handleViewToggle = (view: "grid" | "list") => {
    pushParams({ view });
  };

  return (
    <div className={`flex flex-col gap-3.5 mb-6 transition-opacity ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 min-w-0 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search flashcards... (Press Enter)"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 shadow-sm transition-all"
          />
        </form>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm flex-shrink-0">
          <button
            onClick={() => handleViewToggle("grid")}
            className={`p-1.5 rounded-lg transition-all ${
              currentView === "grid" ? "bg-violet-100 text-violet-600" : "text-gray-400 hover:text-gray-600"
            }`}
            title="Grid view"
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleViewToggle("list")}
            className={`p-1.5 rounded-lg transition-all ${
              currentView === "list" ? "bg-violet-100 text-violet-600" : "text-gray-400 hover:text-gray-600"
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 -mx-6 px-6 scrollbar-none">
          <button
            onClick={() => handleTagClick("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              currentTag === "all"
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-violet-300"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                currentTag === tag
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-violet-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
