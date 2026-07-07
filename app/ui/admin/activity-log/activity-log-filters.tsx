"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition, useState, useEffect } from "react";
import { User, Filter, Calendar, Search } from "lucide-react";
import { ACTION_LABELS } from "@/app/lib/definitions/activity-log";

const ACTION_TYPES = Object.entries(ACTION_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export default function ActivityLogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(searchParams.get("userSearch") ?? "");

  useEffect(() => {
    setSearchValue(searchParams.get("userSearch") ?? "");
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

  const handleUserSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      router.push(`${pathname}?${createQueryString({ userSearch: searchValue })}`);
    });
  };

  const handleReset = () => {
    setSearchValue("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters =
    searchParams.has("userSearch") ||
    searchParams.has("actionType") ||
    searchParams.has("dateRange");

  return (
    <div className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6 transition-opacity ${isPending ? "opacity-60" : ""}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search by user */}
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700">
            User
          </label>
          <form onSubmit={handleUserSearch} className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="userSearch"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
            />
          </form>
        </div>

        {/* Action type */}
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700">
            Action type
          </label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={searchParams.get("actionType") ?? "all"}
              onChange={(e) => handleChange("actionType", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 appearance-none"
            >
              <option value="all">All actions</option>
              {ACTION_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date range */}
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700">
            Time range
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={searchParams.get("dateRange") ?? "all"}
              onChange={(e) => handleChange("dateRange", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 appearance-none"
            >
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="7days">7 days</option>
              <option value="30days">30 days</option>
            </select>
          </div>
        </div>

        {/* Reset */}
        <div className="flex items-end">
          {hasFilters && (
            <button
              onClick={handleReset}
              className="w-full px-4 py-2.5 border border-gray-300 text-slate-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
