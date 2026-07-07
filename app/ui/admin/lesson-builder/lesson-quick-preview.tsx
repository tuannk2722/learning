'use client';

import { FileText, Type, Video, Image as ImageIcon, Code, Clock, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LessonBlock, LessonBuilderData, BlockType, BLOCK_TYPE_META } from '@/app/lib/definitions/lessons';

const BLOCK_ICONS: Record<BlockType, LucideIcon> = {
  text: Type,
  video: Video,
  image: ImageIcon,
  code: Code,
};

interface LessonPreviewSidebarProps {
  data: LessonBuilderData;
  blocks: LessonBlock[];
}

export default function LessonPreviewSidebar({ data, blocks }: LessonPreviewSidebarProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-6">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Quick Preview</h3>

      <div className="space-y-6">
        <h4 className="font-bold text-xl text-slate-900 leading-tight">
          {data.title || 'Untitled Lesson'}
        </h4>

        <div className="flex items-center gap-4 py-4 border-y border-slate-50">
          <div className="flex items-center gap-1.5 text-amber-600 font-bold text-sm">
            <Trophy className="w-4 h-4" />
            <span>{data.xp} XP</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>{data.estimate_time} MIN</span>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
            Content Structure ({blocks.length} blocks)
          </div>
          <div className="space-y-3">
            {blocks.map((block, index) => {
              const meta = BLOCK_TYPE_META[block.type];
              const Icon = BLOCK_ICONS[block.type] ?? FileText;
              return (
                <div key={block.id} className="flex items-center gap-3 group">
                  <div className={`w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className={`w-4 h-4 ${meta.color}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Block {index + 1}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{meta.label}</span>
                  </div>
                </div>
              );
            })}
            {blocks.length === 0 && (
              <p className="text-xs text-slate-400 italic">No content blocks yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
