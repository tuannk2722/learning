'use client';

import { motion } from "motion/react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { LessonBlock } from "@/app/lib/definitions/lessons";
import { CodeBlock } from "../lesson-code-block";

interface LessonBlockRenderProps {
  blocks: LessonBlock[];
}

export function LessonBlockRender({ blocks }: LessonBlockRenderProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-violet-100/50 space-y-6 mb-8"
    >
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
            <div className="my-8 aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <iframe
                width="100%"
                height="100%"
                src={block.content}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          )}

          {block.type === 'image' && (
            <div className="my-8 flex flex-col items-center">
              <img
                src={block.content}
                alt={block.metadata?.caption || 'Lesson Illustration'}
                className="rounded-2xl max-h-[500px] object-contain w-full shadow-md border border-slate-100"
              />
              {block.metadata?.caption && (
                <p className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-widest text-center">
                  {block.metadata.caption}
                </p>
              )}
            </div>
          )}

          {block.type === 'code' && (
            <div className="my-8">
              <CodeBlock
                code={block.content}
                filename={block.metadata?.filename}
                language={block.metadata?.language}
              />
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
}
