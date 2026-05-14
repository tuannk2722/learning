'use client';
import { motion } from 'motion/react';
import { GripVertical, Trash2, Play, Upload } from 'lucide-react';

interface Block {
  id: string;
  type: 'text' | 'video' | 'image' | 'code';
  content: string;
  metadata?: any;
}

interface BlockItemProps {
  block: Block;
  isSelected: boolean;
  blockTypeInfo: any;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  onSelect: () => void;
}

export default function BlockItem({ block, isSelected, blockTypeInfo, onUpdate, onDelete, onSelect }: BlockItemProps) {
  const Icon = blockTypeInfo?.icon;

  const renderEditor = () => {
    switch (block.type) {
      case 'text':
        return (
          <textarea
            value={block.content}
            onChange={(e) => onUpdate(e.target.value)}
            onFocus={onSelect}
            className="w-full px-4 py-3 border-none resize-none focus:outline-none min-h-[100px] text-slate-700 leading-relaxed"
            placeholder="Type your content here... (Markdown supported)"
          />
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-red-600" />
              <input
                type="text"
                value={block.content}
                onChange={(e) => onUpdate(e.target.value)}
                onFocus={onSelect}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="YouTube URL or Video ID"
              />
            </div>
            {block.content && (
              <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                <Play className="w-16 h-16 text-slate-300" />
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer transition-all">
              <Upload className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input
              type="text"
              value={block.content}
              onChange={(e) => onUpdate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Or paste image URL"
            />
          </div>
        );

      case 'code':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium bg-white">
                <option>JavaScript</option>
                <option>Python</option>
                <option>Java</option>
                <option>HTML</option>
                <option>CSS</option>
              </select>
            </div>
            <textarea
              value={block.content}
              onChange={(e) => onUpdate(e.target.value)}
              onFocus={onSelect}
              className="w-full px-5 py-4 bg-slate-900 text-indigo-300 font-mono text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[150px] shadow-inner"
              placeholder="// Your code here"
            />
          </div>
        );
    }
  };

  return (
    <motion.div
      layout
      className={`bg-white border-2 rounded-2xl transition-all overflow-hidden ${isSelected ? 'border-indigo-500 shadow-md shadow-indigo-100' : 'border-gray-100 hover:border-gray-200'
        }`}
    >
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-slate-50/50">
        <GripVertical className="w-5 h-5 text-slate-300 cursor-grab active:cursor-grabbing" />
        <div className={`w-8 h-8 rounded-lg ${blockTypeInfo?.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${blockTypeInfo?.color}`} />
        </div>
        <span className="text-sm font-bold text-slate-700 flex-1 uppercase tracking-wider">{blockTypeInfo?.label}</span>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: '#FEF2F2' }}
          whileTap={{ scale: 0.9 }}
          onClick={onDelete}
          className="p-2 text-red-500 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="p-5">
        {renderEditor()}
      </div>
    </motion.div>
  );
}
