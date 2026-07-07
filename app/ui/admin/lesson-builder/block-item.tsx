'use client';

import { motion } from 'motion/react';
import { GripVertical, Trash2, Play, Upload, Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { uploadLessonImage } from '@/app/lib/actions/upload';
import { toast } from 'sonner';
import { LessonBlock } from '@/app/lib/definitions/lessons';

interface BlockItemProps {
  block: LessonBlock;
  isSelected: boolean;
  blockTypeInfo: { icon: LucideIcon; label: string; color: string; bg: string };
  onUpdate: (content: string, metadata?: LessonBlock['metadata']) => void;
  onDelete: () => void;
  onSelect: () => void;
}

function cleanYoutubeUrl(url: string): string {
  if (!url) return '';
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
}

export default function BlockItem({ block, isSelected, blockTypeInfo, onUpdate, onDelete, onSelect }: BlockItemProps) {
  const Icon = blockTypeInfo.icon;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (block.type === 'text' && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [block.content, block.type]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadLessonImage(formData);

      if (result.success && result.url) {
        onUpdate(result.url, {
          ...block.metadata,
          caption: block.metadata?.caption || file.name.split('.')[0],
        });
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(result.error || 'Failed to upload image.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while uploading.');
    } finally {
      setIsUploading(false);
      // Reset so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const renderEditor = () => {
    switch (block.type) {
      case 'text':
        return (
          <textarea
            ref={textareaRef}
            value={block.content}
            onChange={(e) => onUpdate(e.target.value)}
            onFocus={onSelect}
            className="w-full px-4 py-3 border-none resize-none focus:outline-none min-h-[100px] text-slate-700 leading-relaxed overflow-hidden"
            placeholder="Type your content here... (Markdown supported)"
          />
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-red-600 shrink-0" />
              <input
                type="text"
                value={block.content}
                onChange={(e) => onUpdate(cleanYoutubeUrl(e.target.value))}
                onFocus={onSelect}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="YouTube URL (auto-converted to embed)"
              />
            </div>
            {block.content && (
              <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                <iframe
                  width="100%"
                  height="100%"
                  src={block.content}
                  title="Video Preview"
                  allowFullScreen
                  className="w-full h-full pointer-events-none"
                />
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {block.content ? (
              <div className="relative group border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center max-h-[300px]">
                <img
                  src={block.content}
                  alt="Preview"
                  className="max-h-[300px] object-contain w-full"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Change Image
                </button>
              </div>
            ) : (
              <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-3" />
                    <p className="text-sm font-semibold text-indigo-600 animate-pulse">Uploading image...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-slate-300 mb-3" />
                    <p className="text-sm font-medium text-slate-600">Click to upload image</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP, GIF up to 10MB</p>
                  </>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Image URL</label>
                <input
                  type="text"
                  value={block.content}
                  onChange={(e) => onUpdate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  placeholder="Or paste image URL directly"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Caption</label>
                <input
                  type="text"
                  value={block.metadata?.caption || ''}
                  onChange={(e) => onUpdate(block.content, { ...block.metadata, caption: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  placeholder="Image caption (e.g. Figure 1)"
                />
              </div>
            </div>
          </div>
        );

      case 'code': {
        const currentFilename = block.metadata?.filename || '';
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Filename (optional)</label>
              <input
                type="text"
                value={currentFilename}
                onChange={(e) => onUpdate(block.content, { ...block.metadata, filename: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                placeholder="e.g. index.js, app/page.tsx"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Code</label>
              <textarea
                value={block.content}
                onChange={(e) => onUpdate(e.target.value)}
                onFocus={onSelect}
                className="w-full px-5 py-4 bg-slate-900 text-indigo-300 font-mono text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[150px] shadow-inner"
                placeholder="// Your code here"
              />
            </div>
          </div>
        );
      }
    }
  };

  return (
    <motion.div
      layout
      className={`bg-white border-2 rounded-2xl transition-all overflow-hidden ${
        isSelected ? 'border-indigo-500 shadow-md shadow-indigo-100' : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-slate-50/50">
        <GripVertical className="w-5 h-5 text-slate-300 cursor-grab active:cursor-grabbing" />
        <div className={`w-8 h-8 rounded-lg ${blockTypeInfo.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${blockTypeInfo.color}`} />
        </div>
        <span className="text-sm font-bold text-slate-700 flex-1 uppercase tracking-wider">{blockTypeInfo.label}</span>
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
