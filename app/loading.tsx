import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-violet-600" />
        <p className="text-gray-500 font-medium animate-pulse">Loading experience...</p>
      </div>
    </div>
  );
}
