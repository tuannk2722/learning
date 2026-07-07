'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import QuizHeader from './quiz-header';
import QuizInfoForm from './quiz-info-form';
import QuestionList from './question-list';
import QuizPreviewSidebar from './quiz-preview-sidebar';
import QuizPreviewModal from './quiz-preview-modal';
import { Question, QuestionType } from '@/app/lib/definitions/quizzes';
import { saveQuizBuilder } from '@/app/lib/actions/quiz';
import { ScrollToTop } from '../../scroll-to-top';

interface QuizBuilderClientProps {
  courseId: string;
  lessonId: string;
  quizId?: number;
  initialTitle: string;
  initialPassingScore: number;
  initialQuestions: Question[];
}

export default function QuizBuilderClient({
  courseId,
  lessonId,
  quizId,
  initialTitle,
  initialPassingScore,
  initialQuestions,
}: QuizBuilderClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [passingScore, setPassingScore] = useState(initialPassingScore);
  const [currentQuizId, setCurrentQuizId] = useState<number | undefined>(quizId);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const updateQuestions: React.Dispatch<React.SetStateAction<Question[]>> = (updater) => {
    setQuestions(updater);
    setIsDirty(true);
  };

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);


  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: -Date.now(),
      type,
      question: '',
      options: (type === 'multiple-choice' || type === 'code') ? ['', '', '', ''] : undefined,
      correctAnswer: (type === 'multiple-choice' || type === 'code') ? 0 : type === 'true-false' ? 'true' : '',
      explanation: '',
      xpReward: 20,
    };
    updateQuestions(prev => [...prev, newQuestion]);
    setEditingQuestionId(newQuestion.id);
  };

  const handleUpdateQuestion = (id: number, updates: Partial<Question>) => {
    updateQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleUpdateOption = (questionId: number, optionIndex: number, value: string) => {
    updateQuestions(prev => prev.map(q => {
      if (q.id !== questionId || !q.options) return q;
      const newOptions = [...q.options];
      newOptions[optionIndex] = value;
      return { ...q, options: newOptions };
    }));
  };

  const handleDeleteQuestion = (id: number) => {
    updateQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await saveQuizBuilder(Number(lessonId), {
        quizId: currentQuizId,
        title: title.trim(),
        passingScore,
        questions,
      });

      if (res.success) {
        toast.success('Quiz saved successfully!');
        setIsDirty(false);
        if (res.quizId) setCurrentQuizId(res.quizId);
        if (res.questions) setQuestions(res.questions);
        setEditingQuestionId(null);
        router.refresh();
      } else {
        toast.error('Failed to save quiz: ' + res.error);
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast.error('An unexpected error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <QuizHeader
          courseId={courseId}
          lessonId={lessonId}
          onSave={handleSave}
          onPreview={() => setShowPreviewModal(true)}
          isSaving={isSaving}
          isDirty={isDirty}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <QuizInfoForm
              title={title}
              passingScore={passingScore}
              onTitleChange={(val) => { setTitle(val); setIsDirty(true); }}
              onPassingScoreChange={(val) => { setPassingScore(val); setIsDirty(true); }}
            />

            <QuestionList
              questions={questions}
              onReorder={updateQuestions}
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
              title={title}
              passingScore={passingScore}
              questions={questions}
            />
          </div>
        </div>
      </div>

      <QuizPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title={title}
        passingScore={passingScore}
        questions={questions}
      />

      <ScrollToTop />
    </div>
  );
}
