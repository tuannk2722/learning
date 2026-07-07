import { Activity } from "lucide-react";

export default function ActivityLogHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Activity className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Activity Log
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor all user and system activity.
          </p>
        </div>
      </div>
    </div>
  );
}
