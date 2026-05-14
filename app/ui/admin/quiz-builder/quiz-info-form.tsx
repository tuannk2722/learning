'use client';

import { QuizData } from './types';

interface QuizInfoFormProps {
  data: QuizData;
  onChange: (data: QuizData) => void;
}

export default function QuizInfoForm({ data, onChange }: QuizInfoFormProps) {
  const update = (field: keyof QuizData, value: string | number) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Quiz Information</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Quiz Title *</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g., Calculus Fundamentals Quiz"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            rows={2}
            value={data.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Brief overview of what this quiz covers"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Total XP Reward</label>
            <input
              type="number"
              value={data.totalXp}
              onChange={(e) => update('totalXp', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Passing Score (%)</label>
            <input
              type="number"
              value={data.passingScore}
              onChange={(e) => update('passingScore', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
