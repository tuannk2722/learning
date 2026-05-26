'use client';

interface QuizInfoFormProps {
  title: string;
  passingScore: number;
  onTitleChange: (title: string) => void;
  onPassingScoreChange: (score: number) => void;
}

export default function QuizInfoForm({
  title,
  passingScore,
  onTitleChange,
  onPassingScoreChange,
}: QuizInfoFormProps) {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Quiz Information</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Quiz Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g., Calculus Fundamentals Quiz"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Passing Score (%)</label>
          <input
            type="number"
            value={passingScore}
            onChange={(e) => onPassingScoreChange(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
