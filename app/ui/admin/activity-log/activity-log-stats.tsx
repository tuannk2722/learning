import { Calendar, TrendingUp, Clock, Database } from "lucide-react";

interface ActivityLogStatsProps {
  todayCount: number;
  weekCount: number;
  monthCount: number;
  totalCount: number;
}

const stats = [
  {
    key: "todayCount" as const,
    label: "Today",
    icon: Clock,
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    key: "weekCount" as const,
    label: "7 days",
    icon: Calendar,
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    key: "monthCount" as const,
    label: "30 days",
    icon: TrendingUp,
    gradient: "from-orange-500 to-amber-500",
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    key: "totalCount" as const,
    label: "Total",
    icon: Database,
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

export default function ActivityLogStats({
  todayCount,
  weekCount,
  monthCount,
  totalCount,
}: ActivityLogStatsProps) {
  const values: ActivityLogStatsProps = { todayCount, weekCount, monthCount, totalCount };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.key}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {values[stat.key].toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
