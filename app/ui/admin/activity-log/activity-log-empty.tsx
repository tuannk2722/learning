import { FileQuestion } from "lucide-react";

export default function ActivityLogEmpty() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 flex flex-col items-center justify-center text-center mb-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 border border-gray-100">
        <FileQuestion className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        No activity found.
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Try changing your search keywords or adjusting the filters to find the results you're looking for.
      </p>
    </div>
  );
}
