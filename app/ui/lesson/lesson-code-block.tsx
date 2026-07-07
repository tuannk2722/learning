'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { Clipboard, Check } from 'lucide-react';

const EXT_LANG: Record<string, string> = {
  js: 'javascript', jsx: 'javascript',
  ts: 'typescript', tsx: 'typescript',
  py: 'python',
  java: 'java',
  html: 'html',
  css: 'css',
  sh: 'bash', bash: 'bash',
  json: 'json',
  sql: 'sql',
};

function resolveLanguage(filename?: string, language?: string): string {
  if (language) return language;
  if (!filename) return 'plaintext';
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return EXT_LANG[ext] ?? 'plaintext';
}

interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
}

export function CodeBlock({ code, filename, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lang = resolveLanguage(filename, language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-6 bg-slate-900 text-slate-100 font-mono text-sm">
      {/* File Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950/80">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {filename ?? lang}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-800 rounded-xl transition-all text-xs font-bold text-slate-400 hover:text-slate-100"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Clipboard className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code Render – fenced code block with explicit language so rehype-highlight can colour it */}
      <div className="prose prose-invert max-w-none bg-slate-900 px-6 py-4">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {`\`\`\`${lang}\n${code}\n\`\`\``}
        </ReactMarkdown>
      </div>
    </div>
  );
}
