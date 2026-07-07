'use client';

import { useState } from 'react';
import QuizHeader from './quiz-header';
import QuizInfoForm from './quiz-info-form';
import QuestionList from './question-list';
import QuizPreviewSidebar from './quiz-preview-sidebar';
import { 
  Question, 
  QuestionType, 
  QuizData, 
  DEFAULT_QUIZ_DATA 
} from './types';

interface QuizBuilderClientProps {
  courseId: string;
  lessonId: string;
  initialQuizData?: QuizData;
  initialQuestions?: Question[];
}

export default function QuizBuilderClient({
  courseId,
  lessonId,
  initialQuizData = DEFAULT_QUIZ_DATA,
  initialQuestions = [],
}: QuizBuilderClientProps) {
  const [quizData, setQuizData] = useState<QuizData>(initialQuizData);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: '',
      options: type === 'multiple_choice' ? ['', '', '', ''] : undefined,
      correctAnswer: type === 'multiple_choice' ? 0 : type === 'true_false' ? 0 : '',
      explanation: '',
      xp: 20,
    };
    setQuestions(prev => [...prev, newQuestion]);
    setEditingQuestionId(newQuestion.id);
  };

  const handleUpdateQuestion = (id: string, updates: Partial<Question>) =>
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));

  const handleUpdateOption = (questionId: string, optionIndex: number, value: string) =>
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId || !q.options) return q;
      const newOptions = [...q.options];
      newOptions[optionIndex] = value;
      return { ...q, options: newOptions };
    }));

  const handleDeleteQuestion = (id: string) =>
    setQuestions(prev => prev.filter(q => q.id !== id));

  const handleSave = () => {
    console.log('Saving quiz:', { courseId, lessonId, quizData, questions });
    alert('Quiz data logged to console! (Ready for API integration)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <QuizHeader 
          courseId={courseId} 
          lessonId={lessonId} 
          onSave={handleSave} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <QuizInfoForm 
              data={quizData} 
              onChange={setQuizData} 
            />

            <QuestionList
              questions={questions}
              onReorder={setQuestions}
              onAddQuestion={handleAddQuestion}
              onUpdateQuestion={handleUpdateQuestion}
              onUpdateOption={handleUpdateOption}
              onDeleteQuestion={handleDeleteQuestion}
              editingQuestionId={editingQuestionId}
              setEditingQuestionId={setEditingQuestionId}
            />
          </div>

          <div className="lg:col-span-1">
            <QuizPreviewSidebar 
              quizData={quizData} 
              questions={questions} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
