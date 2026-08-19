'use client';

import { BarChart3, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const RANGES = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "1Y", value: "1y" },
];

export function AnalyticsTitle() {
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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200">
            <BarChart3 className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Analytics
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your learning performance
            </p>
          </div>
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
    </motion.div>
  );
}