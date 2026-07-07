'use client';

import { motion, Reorder, AnimatePresence } from 'motion/react';
import { Plus, Trash2, GripVertical, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import QuestionEditor from './question-editor';
import { Question, QuestionType, QUESTION_TYPES } from '@/app/lib/definitions/quizzes';

interface QuestionListProps {
  questions: Question[];
  onReorder: (questions: Question[]) => void;
  onAddQuestion: (type: QuestionType) => void;
  onUpdateQuestion: (id: number, updates: Partial<Question>) => void;
  onUpdateOption: (questionId: number, optionIndex: number, value: string) => void;
  onDeleteQuestion: (id: number) => void;
  editingQuestionId: number | null;
  setEditingQuestionId: (id: number | null) => void;
}

export default function QuestionList({
  questions,
  onReorder,
  onAddQuestion,
  onUpdateQuestion,
  onUpdateOption,
  onDeleteQuestion,
  editingQuestionId,
  setEditingQuestionId
}: QuestionListProps) {
  const [showQuestionMenu, setShowQuestionMenu] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Questions</h2>

      <Reorder.Group axis="y" values={questions} onReorder={onReorder} className="space-y-4">
        {questions.map((question, index) => {
          const questionTypeInfo = QUESTION_TYPES.find(qt => qt.type === question.type);
          const Icon = questionTypeInfo?.icon || HelpCircle;

          return (
            <Reorder.Item key={question.id} value={question}>
              <motion.div
                whileHover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                className={`border-2 rounded-lg transition-all ${editingQuestionId === question.id ? 'border-indigo-500' : 'border-gray-200'
                  }`}
              >
                <div className="flex items-center gap-3 p-3 border-b border-gray-200 bg-slate-50">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                  <div className={`w-8 h-8 rounded-lg ${questionTypeInfo?.bg} flex items-center justify-center`}>
                    {/* @ts-ignore */}
                    <Icon className={`w-4 h-4 ${questionTypeInfo?.color}`} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium">Question {index + 1}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {questionTypeInfo?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
                    +{question.xpReward} XP
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDeleteQuestion(question.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="p-6">
                  <QuestionEditor
                    question={question}
                    isEditing={editingQuestionId === question.id}
                    onUpdate={(updates) => onUpdateQuestion(question.id, updates)}
                    onUpdateOption={(idx, val) => onUpdateOption(question.id, idx, val)}
                    onFocus={() => setEditingQuestionId(question.id)}
                  />
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

        <AnimatePresence>
          {showQuestionMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-2"
            >
              {QUESTION_TYPES.map((qt) => {
                const Icon = qt.icon || HelpCircle;
                return (
                  <motion.button
                    key={qt.type}
                    whileHover={{ backgroundColor: '#F8FAFC' }}
                    onClick={() => {
                      onAddQuestion(qt.type);
                      setShowQuestionMenu(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-left"
                  >
                    <div className={`w-10 h-10 rounded-lg ${qt.bg} flex items-center justify-center`}>
                      {/* @ts-ignore */}
                      <Icon className={`w-5 h-5 ${qt.color}`} />
                    </div>
                    <div>
                      <div className="font-medium">{qt.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {qt.description}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
