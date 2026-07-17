"use client";

import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';

import Header from './header';
import ProgressSteps from './progress-steps';
import CourseInfoStep from './course-info-step';
import CurriculumStep from './curriculum-step';
import QuizStep from './quiz-step';
import { CourseBuilderResult } from '@/app/lib/definitions/lessons';
import { useCourseBuilderStore } from './course-store';
import { saveCourseBuilder, publishCourseBuilder, UnPublishCourse } from '@/app/lib/actions/course';
import { toast } from 'sonner';

export interface CourseBuilderClientProps {
  initialData?: CourseBuilderResult;
}

export default function CourseBuilderClient({
  initialData
}: CourseBuilderClientProps) {
  const router = useRouter();

  const {
    courseData,
    isDirty,
    isSaving,
    step,
    courseId,
    initCourse,
    setStep,
    setCourseId,
    setIsSaving,
    setIsDirty,
  } = useCourseBuilderStore();

  const lastSyncedRef = useRef<string | null>(null);
  useEffect(() => {
    const fingerprint = JSON.stringify({ id: initialData?.id, sections: initialData?.sections });
    if (fingerprint !== lastSyncedRef.current) {
      lastSyncedRef.current = fingerprint;
      initCourse(initialData);
    }
  }, [initialData, initCourse]);

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

  const handleSaveCourse = async () => {
    setIsSaving(true);
    try {
      const result = await saveCourseBuilder(courseData);
      if (!result.success || !result.course) {
        throw new Error(result.error || 'Failed to save course');
      }
      const isNew = courseId === null;
      initCourse(result.course);
      if (isNew) {
        router.replace(`/admin/courses/${result.course.id}`, { scroll: false });
      } else {
        router.refresh();
      }
      toast.success('Course saved successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishCourse = async () => {
    // Client-side pre-validation: count total lessons across all sections
    const totalLessons = courseData.sections.reduce((sum, s) => sum + s.lessons.length, 0);
    if (totalLessons < 3) {
      toast.error(
        `Need at least 3 lessons to publish. This course currently has ${totalLessons} lesson${totalLessons !== 1 ? 's' : ''}.`
      );
      return;
    }

    setIsSaving(true);
    try {
      const result = await publishCourseBuilder(courseData);
      if (!result.success || !result.course) {
        throw new Error(result.error || 'Failed to publish course');
      }
      initCourse(result.course);
      router.refresh();
      if (result.publishError) {
        // Course was saved as draft, but couldn't be published (failed server-side validation)
        toast.error(`Course saved as draft — ${result.publishError}`);
      } else {
        toast.success('Course published successfully!');
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to publish course');
    } finally {
      setIsSaving(false);
    }
  };

  const handleWithdraw = async () => {
    setIsSaving(true);
    try {
      const result = await UnPublishCourse(Number(courseId));
      if (!result.success || !result.course) {
        throw new Error(result.error || 'Failed to withdraw course');
      }
      initCourse(result.course);
      router.refresh();
      toast.success('Course withdrawn successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to withdraw course');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Header onSave={handleSaveCourse} />

        <ProgressSteps step={step} setStep={setStep} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <CourseInfoStep
              key="step1"
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <CurriculumStep
              key="step2"
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <QuizStep
              key="step3"
              onBack={() => setStep(2)}
              onPublish={handlePublishCourse}
              withdraw={handleWithdraw}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
