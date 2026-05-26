'use client';

import { HelpCircle } from 'lucide-react';
import { Question, QUESTION_TYPES } from '@/app/lib/definitions/quizzes';

interface QuizPreviewSidebarProps {
  title: string;
  passingScore: number;
  questions: Question[];
}

export default function QuizPreviewSidebar({ title, passingScore, questions }: QuizPreviewSidebarProps) {
  const totalXpAvailable = questions.reduce((sum, q) => sum + (q.xpReward || 0), 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-6">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Quick Preview</h3>

      <div className="space-y-4">
        <h4 className="font-medium text-lg">{title || 'Untitled Quiz'}</h4>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">•</span>
          <div className="text-muted-foreground">
            {passingScore}% to pass
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm text-muted-foreground mb-2">Questions</div>
          <div className="space-y-2">
            {questions.map((question, index) => {
              const qtInfo = QUESTION_TYPES.find(qt => qt.type === question.type);
              const Icon = qtInfo?.icon || HelpCircle;
              return (
                <div key={question.id} className="flex items-center gap-2 text-sm">
                  <div className={`w-6 h-6 rounded ${qtInfo?.bg} flex items-center justify-center`}>
                    {/* @ts-ignore */}
                    <Icon className={`w-3 h-3 ${qtInfo?.color}`} />
                  </div>
                  <div className="flex-1">
                    <span className="text-muted-foreground">
                      Q{index + 1}: {qtInfo?.label}
                    </span>
                  </div>
                  <span className="text-xs text-yellow-600 font-medium">
                    +{question.xpReward || 0} XP
                  </span>
                </div>
              );
            })}
          </div>

          {questions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Questions</span>
                <span className="font-medium">{questions.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Total XP Available</span>
                <span className="font-medium text-yellow-600">
                  +{totalXpAvailable} XP
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
