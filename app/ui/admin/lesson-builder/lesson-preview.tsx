'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { CodeBlock } from '@/app/ui/lesson/lesson-code-block';
import { LessonBlock, LessonBuilderData } from '@/app/lib/definitions/lessons';

interface LessonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonData: LessonBuilderData;
  blocks: LessonBlock[];
}

export default function LessonPreviewModal({
  isOpen,
  onClose,
  lessonData,
  blocks,
}: LessonPreviewModalProps) {
  // Prevent page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 overflow-y-auto">
          {/* Backdrop Overlay with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            className="relative w-full h-full md:h-[85vh] md:max-w-4xl bg-slate-50 md:rounded-3xl shadow-2xl border border-slate-100 z-10 flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 text-xs font-bold text-violet-600 bg-violet-50 rounded-full border border-violet-100 uppercase tracking-wide">
                  Student View Preview
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-50 text-gray-400 hover:text-gray-600 transition-colors border border-transparent hover:border-slate-100 cursor-pointer"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content (Simulates Student View background) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/50">
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Lesson Title & Meta Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-amber-600 font-extrabold text-xs bg-amber-50 border border-amber-100/50 px-2.5 py-0.5 rounded-full">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{lessonData.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 font-extrabold text-xs bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{lessonData.estimate_time} MIN</span>
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                    {lessonData.title || 'Untitled Lesson'}
                  </h1>
                </div>

                {/* Lesson Content Box (The Bright White Card) */}
                <div className="bg-white rounded-3xl p-6 md:p-10 shadow-md border border-slate-150 space-y-6">
                  {blocks.map((block) => (
                    <div key={block.id}>
                      {block.type === 'text' && (
                        <div className="prose prose-lg prose-violet max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                          >
                            {block.content}
                          </ReactMarkdown>
                        </div>
                      )}

                      {block.type === 'video' && (
                        <div className="my-6 aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                          {block.content ? (
                            <iframe
                              width="100%"
                              height="100%"
                              src={block.content}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-slate-950">
                              <span className="text-sm font-semibold">No Video Link</span>
                              <span className="text-[11px] text-slate-600">Add a YouTube video URL to preview here</span>
                            </div>
                          )}
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div className="my-6 flex flex-col items-center">
                          {block.content ? (
                            <img
                              src={block.content}
                              alt={block.metadata?.caption || 'Lesson Illustration'}
                              className="rounded-2xl max-h-[450px] object-contain w-full shadow-sm border border-slate-100"
                            />
                          ) : (
                            <div className="w-full h-40 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-1">
                              <span className="text-xs font-semibold">No Image Selected</span>
                            </div>
                          )}
                          {block.metadata?.caption && (
                            <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest text-center">
                              {block.metadata.caption}
                            </p>
                          )}
                        </div>
                      )}

                      {block.type === 'code' && (
                        <div className="my-6">
                          <CodeBlock
                            code={block.content || '// Code snippet placeholder'}
                            filename={block.metadata?.filename}
                            language={block.metadata?.language}
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {blocks.length === 0 && (
                    <div className="text-center py-10 text-slate-400 italic text-sm">
                      No blocks added yet. Start editing to see content here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
