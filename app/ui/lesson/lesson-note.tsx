'use client';
import { BookOpen, Check, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useTransition } from 'react';
import { saveNote, deleteNote } from '@/app/lib/actions/note';

interface LessonNoteProps {
  lessonId: string;
  initialContent: string | null;
}

export function LessonNote({ lessonId, initialContent }: LessonNoteProps) {
  const [content, setContent] = useState(initialContent || '');
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);

  const hasChanged = content !== (initialContent || '');

  const handleSave = () => {
    if (!content.trim() || !hasChanged) return;

    startTransition(async () => {
      const result = await saveNote(lessonId, content);
      if (result.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    });
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    startTransition(async () => {
      const result = await deleteNote(lessonId);
      if (result.success) {
        setContent('');
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-yellow-50 rounded-3xl p-8 border-2 border-yellow-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-yellow-600" />
          Take a note
        </h4>
        {initialContent && (
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
            title="Delete note"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write notes for this lesson..."
        className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:border-yellow-400 focus:outline-none resize-none bg-white"
        rows={4}
        disabled={isPending}
      />

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isPending || !hasChanged || !content.trim()}
          className="px-6 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSaved ? "Saved!" : "Save note"}
        </button>

        <AnimatePresence>
          {isSaved && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 text-emerald-600 font-medium text-sm"
            >
              <Check className="w-4 h-4" />
              Successfully saved
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
