'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import LessonHeader from './lesson-header';
import LessonInfoForm from './lesson-info-form';
import ContentEditor from './content-editor';
import LessonPreviewSidebar from './lesson-quick-preview';
import LessonPreviewModal from './lesson-preview';
import { saveLessonBlocks } from '@/app/lib/actions/lesson';
import { LessonBlock, LessonBuilderData } from '@/app/lib/definitions/lessons';

interface LessonBuilderClientProps {
  courseId: string;
  lessonId: string;
  initialLesson: LessonBuilderData;
  initialBlocks: LessonBlock[];
}

export default function LessonBuilderClient({ courseId, lessonId, initialLesson, initialBlocks }: LessonBuilderClientProps) {
  const [lessonData, setLessonData] = useState<LessonBuilderData>(initialLesson);
  const [blocks, setBlocks] = useState<LessonBlock[]>(initialBlocks);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const updateLessonData: React.Dispatch<React.SetStateAction<LessonBuilderData>> = (updater) => {
    setLessonData(updater);
    setIsDirty(true);
  };

  const updateBlocks: React.Dispatch<React.SetStateAction<LessonBlock[]>> = (updater) => {
    setBlocks(updater);
    setIsDirty(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleAddBlock = (type: LessonBlock['type']) => {
    const newBlock: LessonBlock = {
      id: Date.now().toString(),
      type,
      content:
        type === 'text' ? '' :
          type === 'video' ? '' :
            type === 'code' ? '// Your code here' : '',
    };
    updateBlocks(prev => [...prev, newBlock]);
  };

  const handleUpdateBlock = (id: string, content: string, metadata?: LessonBlock['metadata']) => {
    updateBlocks(prev => prev.map(block =>
      block.id === id
        ? { ...block, content, metadata: metadata !== undefined ? metadata : block.metadata }
        : block
    ));
  };

  const handleDeleteBlock = (id: string) => {
    updateBlocks(prev => prev.filter(block => block.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await saveLessonBlocks(Number(lessonId), {
        title: lessonData.title,
        duration_minutes: lessonData.estimate_time,
        xp_reward: lessonData.xp,
        blocks,
      });

      if (res.success) {
        toast.success('Lesson saved successfully!');
        setIsDirty(false);
      } else {
        toast.error('Failed to save lesson: ' + res.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred while saving the lesson.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        <LessonHeader courseId={courseId} onSave={handleSave} onPreview={handlePreview} isSaving={isSaving} isDirty={isDirty} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <LessonInfoForm data={lessonData} onChange={updateLessonData} />

            <ContentEditor
              blocks={blocks}
              onReorder={updateBlocks}
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

      <LessonPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        lessonData={lessonData}
        blocks={blocks}
      />
    </div>
  );
}
