import { BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Sparkles className="w-16 h-16 text-violet-600 mx-auto mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Course Not Found
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          The course may be deleted by the administrator or not exist
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href={`/dashboard/courses`}
            className="px-6 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 hover:scale-[1.02] shadow-md shadow-violet-500/10"
          >
            <BookOpen className="w-5 h-5" />
            Discover Other Courses
          </Link>
        </div>
      </div>
    </div>
  )
}