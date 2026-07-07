import { FileText } from "lucide-react";
import type { ActivityLogWithUser } from "@/app/lib/definitions/activity-log";
import ActivityLogItem from "./activity-log-item";
import ActivityLogEmpty from "./activity-log-empty";

interface ActivityLogTimelineProps {
  logs: ActivityLogWithUser[];
}

export default function ActivityLogTimeline({ logs }: ActivityLogTimelineProps) {
  if (logs.length === 0) {
    return <ActivityLogEmpty />;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
      <div className="p-5 border-b border-gray-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          Operational timeline
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        {logs.map((log, index) => (
          <ActivityLogItem key={log.id} log={log} index={index} />
        ))}
      </div>
    </div>
  );
}
