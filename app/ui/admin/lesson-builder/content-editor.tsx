'use client';
import { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { Plus, Type, Video, Image as ImageIcon, Code } from 'lucide-react';
import BlockItem from './block-item';

interface Block {
  id: string;
  type: 'text' | 'video' | 'image' | 'code';
  content: string;
  metadata?: any;
}

interface ContentEditorProps {
  blocks: Block[];
  onReorder: (newBlocks: Block[]) => void;
  onUpdateBlock: (id: string, content: string) => void;
  onDeleteBlock: (id: string) => void;
  onAddBlock: (type: Block['type']) => void;
}

const blockTypes = [
  { type: 'text', icon: Type, label: 'Text', color: 'text-blue-600', bg: 'bg-blue-50' },
  { type: 'video', icon: Video, label: 'Video', color: 'text-red-600', bg: 'bg-red-50' },
  { type: 'image', icon: ImageIcon, label: 'Image', color: 'text-green-600', bg: 'bg-green-50' },
  { type: 'code', icon: Code, label: 'Code', color: 'text-purple-600', bg: 'bg-purple-50' },
];

export default function ContentEditor({ blocks, onReorder, onUpdateBlock, onDeleteBlock, onAddBlock }: ContentEditorProps) {
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold mb-6">Lesson Content</h2>

      <Reorder.Group axis="y" values={blocks} onReorder={onReorder} className="space-y-6">
        {blocks.map((block) => (
          <Reorder.Item key={block.id} value={block}>
            <BlockItem
              block={block}
              isSelected={selectedBlock === block.id}
              blockTypeInfo={blockTypes.find(bt => bt.type === block.type)}
              onUpdate={(content) => onUpdateBlock(block.id, content)}
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
          className="w-full p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-indigo-400 flex items-center justify-center gap-3 text-slate-400 hover:text-indigo-600 transition-all group"
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
            {blockTypes.map((bt) => {
              const Icon = bt.icon;
              return (
                <motion.button
                  key={bt.type}
                  whileHover={{ scale: 1.05, backgroundColor: '#F8FAFC' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onAddBlock(bt.type as Block['type']);
                    setShowBlockMenu(false);
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all border border-transparent hover:border-slate-100"
                >
                  <div className={`w-12 h-12 rounded-xl ${bt.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${bt.color}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 uppercase">{bt.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
