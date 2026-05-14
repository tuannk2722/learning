'use client'

import { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import {
  ArrowLeft, Save, Eye, Plus, Trash2, GripVertical,
  CheckCircle, HelpCircle, Edit2, Type, ToggleLeft
} from 'lucide-react';
import Link from 'next/link';

type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank';

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  xp: number;
}

export default function QuizBuilder() {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    totalXp: 100,
    passingScore: 70
  });

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      type: 'multiple_choice',
      question: 'What is the derivative of x²?',
      options: ['2x', 'x', '2', 'x²'],
      correctAnswer: 0,
      explanation: 'Using the power rule: d/dx(x²) = 2x¹ = 2x',
      xp: 20
    }
  ]);

  const [showQuestionMenu, setShowQuestionMenu] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  const questionTypes = [
    {
      type: 'multiple_choice',
      icon: CheckCircle,
      label: 'Multiple Choice',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      description: '4 options, 1 correct answer'
    },
    {
      type: 'true_false',
      icon: ToggleLeft,
      label: 'True / False',
      color: 'text-green-600',
      bg: 'bg-green-100',
      description: 'Simple true or false question'
    },
    {
      type: 'fill_blank',
      icon: Type,
      label: 'Fill in the Blank',
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      description: 'Type the correct answer'
    }
  ];

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: '',
      options: type === 'multiple_choice' ? ['', '', '', ''] : undefined,
      correctAnswer: type === 'multiple_choice' ? 0 : type === 'true_false' ? 0 : '',
      explanation: '',
      xp: 20
    };
    setQuestions([...questions, newQuestion]);
    setEditingQuestion(newQuestion.id);
    setShowQuestionMenu(false);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const renderQuestionEditor = (question: Question) => {
    const isEditing = editingQuestion === question.id;
    const questionType = questionTypes.find(qt => qt.type === question.type);

    return (
      <div className="space-y-4">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium mb-2">Question</label>
          <textarea
            value={question.question}
            onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
            onFocus={() => setEditingQuestion(question.id)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
            placeholder="Enter your question here..."
          />
        </div>

        {/* Answer Options */}
        {question.type === 'multiple_choice' && question.options && (
          <div>
            <label className="block text-sm font-medium mb-2">Answer Options</label>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctAnswer === index}
                    onChange={() => updateQuestion(question.id, { correctAnswer: index })}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(question.id, index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {question.correctAnswer === index && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {question.type === 'true_false' && (
          <div>
            <label className="block text-sm font-medium mb-2">Correct Answer</label>
            <div className="flex gap-4">
              <button
                onClick={() => updateQuestion(question.id, { correctAnswer: 0 })}
                className={`flex-1 px-6 py-3 rounded-lg border-2 font-medium transition-all ${question.correctAnswer === 0
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                True
              </button>
              <button
                onClick={() => updateQuestion(question.id, { correctAnswer: 1 })}
                className={`flex-1 px-6 py-3 rounded-lg border-2 font-medium transition-all ${question.correctAnswer === 1
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                False
              </button>
            </div>
          </div>
        )}

        {question.type === 'fill_blank' && (
          <div>
            <label className="block text-sm font-medium mb-2">Correct Answer</label>
            <input
              type="text"
              value={question.correctAnswer as string}
              onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
              placeholder="Type the correct answer"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-muted-foreground mt-1">Case-insensitive matching</p>
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
            onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
            placeholder="Explain why this is the correct answer..."
          />
        </div>

        {/* XP Reward */}
        <div>
          <label className="block text-sm font-medium mb-2">XP Reward</label>
          <input
            type="number"
            value={question.xp}
            onChange={(e) => updateQuestion(question.id, { xp: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/courses">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Quiz Builder</h1>
              <p className="text-muted-foreground">Create interactive assessments</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Quiz
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quiz Info */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Quiz Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quiz Title *</label>
                  <input
                    type="text"
                    value={quizData.title}
                    onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                    placeholder="e.g., Calculus Fundamentals Quiz"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    rows={2}
                    value={quizData.description}
                    onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                    placeholder="Brief overview of what this quiz covers"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Total XP Reward</label>
                    <input
                      type="number"
                      value={quizData.totalXp}
                      onChange={(e) => setQuizData({ ...quizData, totalXp: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Passing Score (%)</label>
                    <input
                      type="number"
                      value={quizData.passingScore}
                      onChange={(e) => setQuizData({ ...quizData, passingScore: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Questions</h2>

              <Reorder.Group axis="y" values={questions} onReorder={setQuestions} className="space-y-4">
                {questions.map((question, index) => {
                  const questionType = questionTypes.find(qt => qt.type === question.type);
                  const Icon = questionType?.icon || HelpCircle;

                  return (
                    <Reorder.Item key={question.id} value={question}>
                      <motion.div
                        whileHover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        className={`border-2 rounded-lg transition-all ${editingQuestion === question.id ? 'border-indigo-500' : 'border-gray-200'
                          }`}
                      >
                        <div className="flex items-center gap-3 p-3 border-b border-gray-200 bg-slate-50">
                          <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                          <div className={`w-8 h-8 rounded-lg ${questionType?.bg} flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${questionType?.color}`} />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium">Question {index + 1}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {questionType?.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
                            +{question.xp} XP
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteQuestion(question.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>

                        <div className="p-6">
                          {renderQuestionEditor(question)}
                        </div>
                      </motion.div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>

              {/* Add Question Button */}
              <div className="relative mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowQuestionMenu(!showQuestionMenu)}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 flex items-center justify-center gap-2 text-muted-foreground hover:text-indigo-600"
                >
                  <Plus className="w-5 h-5" />
                  Add Question
                </motion.button>

                {showQuestionMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-2"
                  >
                    {questionTypes.map((questionType) => {
                      const Icon = questionType.icon;
                      return (
                        <motion.button
                          key={questionType.type}
                          whileHover={{ backgroundColor: '#F8FAFC' }}
                          onClick={() => addQuestion(questionType.type as QuestionType)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg text-left"
                        >
                          <div className={`w-10 h-10 rounded-lg ${questionType.bg} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${questionType.color}`} />
                          </div>
                          <div>
                            <div className="font-medium">{questionType.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {questionType.description}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-6">
              <h3 className="font-semibold mb-4">Quiz Preview</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-lg">{quizData.title || 'Untitled Quiz'}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {quizData.description || 'No description yet'}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-yellow-600">
                    <span className="font-medium">+{quizData.totalXp}</span>
                    <span>XP</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className="text-muted-foreground">
                    {quizData.passingScore}% to pass
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-muted-foreground mb-2">Questions</div>
                  <div className="space-y-2">
                    {questions.map((question, index) => {
                      const questionType = questionTypes.find(qt => qt.type === question.type);
                      const Icon = questionType?.icon || HelpCircle;
                      return (
                        <div key={question.id} className="flex items-center gap-2 text-sm">
                          <div className={`w-6 h-6 rounded ${questionType?.bg} flex items-center justify-center`}>
                            <Icon className={`w-3 h-3 ${questionType?.color}`} />
                          </div>
                          <div className="flex-1">
                            <span className="text-muted-foreground">
                              Q{index + 1}: {questionType?.label}
                            </span>
                          </div>
                          <span className="text-xs text-yellow-600 font-medium">
                            +{question.xp}
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
                          +{questions.reduce((sum, q) => sum + q.xp, 0)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
