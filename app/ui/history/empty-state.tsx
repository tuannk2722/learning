import { BookOpen } from 'lucide-react';

export function HistoryEmptyState() {
  return (
    <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
        <BookOpen className="w-10 h-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activities Found</h3>
      <p className="text-muted-foreground max-w-xs mx-auto">
        Your learning journey is just beginning. Start a course to see your history here!
      </p>
    </div>
  );
}
