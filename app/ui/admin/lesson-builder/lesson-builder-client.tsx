'use client';
import { useState } from 'react';
import LessonHeader from './lesson-header';
import LessonInfoForm from './lesson-info-form';
import ContentEditor from './content-editor';
import LessonPreviewSidebar from './lesson-preview-sidebar';

interface Block {
  id: string;
  type: 'text' | 'video' | 'image' | 'code';
  content: string;
  metadata?: any;
}

interface LessonData {
  title: string;
  description: string;
  xp: number;
  estimate_time: number;
}

interface LessonBuilderClientProps {
  initialLesson: LessonData;
  initialBlocks: Block[];
}

export default function LessonBuilderClient({ initialLesson, initialBlocks }: LessonBuilderClientProps) {
  const [lessonData, setLessonData] = useState<LessonData>(initialLesson);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);

  const handleAddBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'Start typing...' :
        type === 'video' ? 'https://www.youtube.com/watch?v=' :
          type === 'code' ? '// Your code here' : ''
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleUpdateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, content } : block
    ));
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const handleSave = () => {
    console.log('Saving lesson:', { lessonData, blocks });
    // TODO: Call API to save
    alert('Lesson saved successfully!');
  };

  const handlePreview = () => {
    alert('Opening preview mode...');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        <LessonHeader onSave={handleSave} onPreview={handlePreview} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <LessonInfoForm data={lessonData} onChange={setLessonData} />
            
            <ContentEditor 
              blocks={blocks} 
              onReorder={setBlocks}
              onUpdateBlock={handleUpdateBlock}
              onDeleteBlock={handleDeleteBlock}
              onAddBlock={handleAddBlock}
            />
          </div>

          <div className="lg:col-span-1">
            <LessonPreviewSidebar data={lessonData} blocks={blocks} />
          </div>
        </div>
      </div>
    </div>
  );
}
