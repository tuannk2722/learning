"use client";

interface CurriculumSummaryProps {
  totalSections: number;
  totalLessons: number;
}

export function CurriculumSummary({ totalSections, totalLessons }: CurriculumSummaryProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 ml-2">Course Summary</h3>

      <div className="space-y-4">
        <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100 transition-all hover:shadow-md">
          <div className="text-[10px] font-bold text-violet-600 uppercase tracking-tight mb-1">Total Sections</div>
          <div className="text-3xl font-black text-violet-900">{totalSections}</div>
        </div>

        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 transition-all hover:shadow-md">
          <div className="text-[10px] font-bold text-blue-600 uppercase tracking-tight mb-1">Total Lessons</div>
          <div className="text-3xl font-black text-blue-900">{totalLessons}</div>
        </div>
      </div>

      <div className="mt-8 p-5 bg-slate-900 rounded-2xl shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <div className="flex items-start gap-3 relative z-10">
          <div className="text-xl">💡</div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 tracking-widest">Builder Tip</div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              Group related lessons into logical sections to help students navigate their learning journey more effectively.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
