'use client';
import { FileText, Type, Video, Image as ImageIcon, Code, Clock, Trophy } from 'lucide-react';

interface Block {
  id: string;
  type: 'text' | 'video' | 'image' | 'code';
  content: string;
}

interface LessonPreviewSidebarProps {
  data: {
    title: string;
    description: string;
    xp: number;
    estimate_time: number;
  };
  blocks: Block[];
}

const blockTypes = [
  { type: 'text', icon: Type, label: 'Text', color: 'text-blue-600', bg: 'bg-blue-50' },
  { type: 'video', icon: Video, label: 'Video', color: 'text-red-600', bg: 'bg-red-50' },
  { type: 'image', icon: ImageIcon, label: 'Image', color: 'text-green-600', bg: 'bg-green-50' },
  { type: 'code', icon: Code, label: 'Code', color: 'text-purple-600', bg: 'bg-purple-50' },
];

export default function LessonPreviewSidebar({ data, blocks }: LessonPreviewSidebarProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-6">
      <h3 className="font-bold text-slate-800 mb-6 uppercase tracking-widest text-sm">Quick Preview</h3>

      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-xl text-slate-900 leading-tight">
            {data.title || 'Untitled Lesson'}
          </h4>
          <p className="text-sm text-slate-500 mt-2 line-clamp-3">
            {data.description || 'No description provided yet.'}
          </p>
        </div>

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
              const bt = blockTypes.find(t => t.type === block.type);
              const Icon = bt?.icon || FileText;
              return (
                <div key={block.id} className="flex items-center gap-3 group">
                  <div className={`w-8 h-8 rounded-lg ${bt?.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className={`w-4 h-4 ${bt?.color}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Block {index + 1}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{bt?.label}</span>
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
