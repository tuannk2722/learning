"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition, useState, useEffect } from "react";
import { Filter, Search, RotateCcw } from "lucide-react";

export default function UserFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(searchParams.get("searchQuery") ?? "");

  useEffect(() => {
    setSearchValue(searchParams.get("searchQuery") ?? "");
  }, [searchParams]);

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const handleChange = (key: string, value: string) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString({ [key]: value })}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      router.push(`${pathname}?${createQueryString({ searchQuery: searchValue })}`);
    });
  };

  const handleReset = () => {
    setSearchValue("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters = searchParams.has("searchQuery") || searchParams.has("status");

  return (
    <div className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6 transition-opacity ${isPending ? "opacity-60" : ""}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700">
            Search
          </label>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="searchQuery"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
            />
          </form>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700">
            Status
          </label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={searchParams.get("status") ?? "all"}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 appearance-none text-slate-700 font-medium"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Reset */}
        <div className="flex items-end">
          {hasFilters && (
            <button
              onClick={handleReset}
              className="w-full px-4 py-2.5 border border-gray-300 text-slate-600 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
