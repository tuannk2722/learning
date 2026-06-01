"use client";

import { useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';

import Header from './header';
import ProgressSteps from './progress-steps';
import CourseInfoStep from './course-info-step';
import CurriculumStep from './curriculum-step';
import QuizStep from './quiz-step';
import { CourseBuilderResult } from '@/app/lib/definitions/lessons';
import { useCourseBuilderStore } from './course-store';
import { saveCourseBuilder } from '@/app/lib/actions/course';
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

  useEffect(() => {
    initCourse(initialData);
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

  const saveCourse = async (publish: boolean = false) => {
    setIsSaving(true);
    const actionName = publish ? "publish" : "save";

    try {
      const result = await saveCourseBuilder(courseData, publish);
      if (!result.success || !result.course) {
        throw new Error(result.error || `Failed to ${actionName} course`);
      }

      const isNew = courseId === null;
      initCourse(result.course);
      if (isNew) {
        router.replace(`/admin/courses/${result.course.id}`, { scroll: false });
      } else {
        router.refresh();
      }

      toast.success(
        publish ? "Course published successfully!" : "Course saved successfully!"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : `Failed to ${actionName} course`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCourse = () => saveCourse(false);
  const handlePublishCourse = () => saveCourse(true);

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
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
