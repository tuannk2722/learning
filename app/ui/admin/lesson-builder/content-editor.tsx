'use client';

import { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { Plus, Type, Video, Image as ImageIcon, Code } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import BlockItem from './block-item';
import { LessonBlock, BlockType, BLOCK_TYPE_META } from '@/app/lib/definitions/lessons';

// Attach Lucide icons – kept here so definitions stay icon-free
const BLOCK_ICONS: Record<BlockType, LucideIcon> = {
  text: Type,
  video: Video,
  image: ImageIcon,
  code: Code,
};

interface ContentEditorProps {
  blocks: LessonBlock[];
  onReorder: (newBlocks: LessonBlock[]) => void;
  onUpdateBlock: (id: string, content: string, metadata?: LessonBlock['metadata']) => void;
  onDeleteBlock: (id: string) => void;
  onAddBlock: (type: BlockType) => void;
}

export default function ContentEditor({ blocks, onReorder, onUpdateBlock, onDeleteBlock, onAddBlock }: ContentEditorProps) {
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const blockTypeEntries = (Object.keys(BLOCK_TYPE_META) as BlockType[]).map(type => ({
    type,
    icon: BLOCK_ICONS[type],
    ...BLOCK_TYPE_META[type],
  }));

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Lesson Content</h2>

      <Reorder.Group axis="y" values={blocks} onReorder={onReorder} className="space-y-6">
        {blocks.map((block) => (
          <Reorder.Item key={block.id} value={block}>
            <BlockItem
              block={block}
              isSelected={selectedBlock === block.id}
              blockTypeInfo={{ icon: BLOCK_ICONS[block.type], ...BLOCK_TYPE_META[block.type] }}
              onUpdate={(content, metadata) => onUpdateBlock(block.id, content, metadata)}
              onDelete={() => onDeleteBlock(block.id)}
              onSelect={() => setSelectedBlock(block.id)}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Add Block Button */}
      <div className="relative mt-8">
        <motion.button
          whileHover={{ scale: 1.01, backgroundColor: '#F5F3FF' }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setShowBlockMenu(!showBlockMenu)}
          className="w-full p-3 border-2 border-dashed border-slate-200 rounded-2xl hover:border-indigo-400 flex items-center justify-center gap-3 text-slate-400 hover:text-indigo-600 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold uppercase tracking-widest text-sm">Add Content Block</span>
        </motion.button>

        {showBlockMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute z-10 bottom-full mb-4 w-full bg-white border border-gray-200 rounded-2xl shadow-2xl p-3 grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {blockTypeEntries.map(({ type, icon: Icon, label, color, bg }) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05, backgroundColor: '#F8FAFC' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onAddBlock(type);
                  setShowBlockMenu(false);
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all border border-transparent hover:border-slate-100"
              >
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase">{label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
