import ActivityLogHeader from "@/app/ui/admin/activity-log/activity-log-header";
import ActivityLogStats from "@/app/ui/admin/activity-log/activity-log-stats";
import ActivityLogFilters from "@/app/ui/admin/activity-log/activity-log-filters";
import ActivityLogTimeline from "@/app/ui/admin/activity-log/activity-log-timeline";
import ActivityLogPagination from "@/app/ui/admin/activity-log/activity-log-pagination";
import { getActivityLogs, getActivityLogStats } from "@/app/lib/data/activity-logs";

interface SearchParams {
  userSearch?: string;
  actionType?: string;
  dateRange?: "today" | "7days" | "30days" | "all";
  page?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ActivityLogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? "1");
  const userSearch = params.userSearch;
  const actionType = params.actionType;
  const dateRange = params.dateRange;

  const [{ logs, totalPages }, stats] = await Promise.all([
    getActivityLogs({
      userSearch,
      actionType,
      dateRange,
      page: currentPage,
      pageSize: 20,
    }),
    getActivityLogStats(),
  ]);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <ActivityLogHeader />
        
        <ActivityLogStats
          todayCount={stats.todayCount}
          weekCount={stats.weekCount}
          monthCount={stats.monthCount}
          totalCount={stats.totalCount}
        />

        <ActivityLogFilters />

        <ActivityLogTimeline logs={logs} />

        <ActivityLogPagination
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
