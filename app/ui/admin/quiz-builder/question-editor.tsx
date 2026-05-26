'use client';

import { HelpCircle, CheckCircle } from 'lucide-react';
import { Question, QuestionType } from '@/app/lib/definitions/quizzes';

interface QuestionEditorProps {
  question: Question;
  isEditing: boolean;
  onUpdate: (updates: Partial<Question>) => void;
  onUpdateOption: (index: number, value: string) => void;
  onFocus: () => void;
}

export default function QuestionEditor({
  question,
  isEditing,
  onUpdate,
  onUpdateOption,
  onFocus
}: QuestionEditorProps) {
  return (
    <div className="space-y-4">
      {/* Question Text */}
      <div>
        <label className="block text-sm font-medium mb-2">Question</label>
        <textarea
          value={question.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          onFocus={onFocus}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
          placeholder="Enter your question here..."
        />
      </div>

      {/* Multiple Choice Options */}
      {question.type === 'multiple-choice' && question.options && (
        <div>
          <label className="block text-sm font-medium mb-2">Answer Options</label>
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={question.correctAnswer === index}
                  onChange={() => onUpdate({ correctAnswer: index })}
                  className="w-4 h-4 text-indigo-600"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => onUpdateOption(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {question.correctAnswer === index && (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* True / False */}
      {question.type === 'true-false' && (
        <div>
          <label className="block text-sm font-medium mb-2">Correct Answer</label>
          <div className="flex gap-4">
            <button
              onClick={() => onUpdate({ correctAnswer: 'true' })}
              className={`flex-1 px-6 py-3 rounded-lg border-2 font-medium transition-all ${question.correctAnswer === 'true'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              True
            </button>
            <button
              onClick={() => onUpdate({ correctAnswer: 'false' })}
              className={`flex-1 px-6 py-3 rounded-lg border-2 font-medium transition-all ${question.correctAnswer === 'false'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              False
            </button>
          </div>
        </div>
      )}

      {/* Fill in the Blank */}
      {question.type === 'fill-blank' && (
        <div>
          <label className="block text-sm font-medium mb-2">Correct Answer</label>
          <input
            type="text"
            value={question.correctAnswer as string}
            onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
            placeholder="Type the correct answer"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-muted-foreground mt-1">Case-insensitive matching</p>
        </div>
      )}

      {/* Code Question */}
      {question.type === 'code' && question.options && (
        <div className="space-y-4">
          <div>
            <label className="block text-slate-500 text-sm font-medium mb-2">Code Snippet</label>
            <textarea
              value={question.code || ''}
              onChange={(e) => onUpdate({ code: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 text-indigo-300 font-mono text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
              placeholder="// Write your code here..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Answer Options</label>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctAnswer === index}
                    onChange={() => onUpdate({ correctAnswer: index })}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => onUpdateOption(index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {question.correctAnswer === index && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-purple-600" />
          Explanation (Important for Learning)
        </label>
        <textarea
          value={question.explanation}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
          placeholder="Explain why this is the correct answer..."
        />
      </div>

      {/* XP Reward */}
      <div>
        <label className="block text-sm font-medium mb-2">XP Reward</label>
        <input
          type="number"
          value={question.xpReward || 0}
          onChange={(e) => onUpdate({ xpReward: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
