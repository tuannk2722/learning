'use client';

interface LessonData {
  title: string;
  xp: number;
  estimate_time: number;
}

interface LessonInfoFormProps {
  data: LessonData;
  onChange: (newData: LessonData) => void;
}

export default function LessonInfoForm({ data, onChange }: LessonInfoFormProps) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        Lesson Information
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">Lesson Title *</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="e.g., Introduction to Derivatives"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">XP Reward</label>
            <div className="relative">
              <input
                type="number"
                value={data.xp}
                onChange={(e) => onChange({ ...data, xp: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-600">XP</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">Estimated Time</label>
            <div className="relative">
              <input
                type="number"
                value={data.estimate_time}
                onChange={(e) => onChange({ ...data, estimate_time: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">MIN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
