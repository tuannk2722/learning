'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Calendar } from "lucide-react";

const RANGES = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "1Y", value: "1y" },
];

export function AdminDashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentRange = searchParams.get("range") || "7d";

  const handleRangeChange = (range: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-4xl mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent font-bold">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Platform overview and key metrics</p>
      </div>
      <div className="flex items-center gap-3">
        {/* Date range picker */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <div className="pl-2 pr-1 text-gray-400 hidden sm:flex items-center">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          {RANGES.map((r) => {
            const isActive = currentRange === r.value;
            return (
              <button
                key={r.value}
                onClick={() => handleRangeChange(r.value)}
                disabled={isPending}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                } ${isPending ? "opacity-70" : ""}`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}