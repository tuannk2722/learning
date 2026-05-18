"use client";

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';

import { levels, iconOptions, colorOptions } from './course-types';
import Header from './header';
import ProgressSteps from './progress-steps';
import CourseInfoStep from '../course-info-step';
import CurriculumStep from './curriculum-step';
import QuizStep from './quiz-step';
import { CourseBuilderLesson, CourseBuilderResult, CourseBuilderSection } from '@/app/lib/definitions/lessons';
import { Category } from '@/app/lib/definitions/courses';

const defaultCourseData: CourseBuilderResult = {
  id: 0,
  name: '',
  description: '',
  category_id: 1,
  category_name: 'Web Development',
  level: levels[0],
  icon: iconOptions[0].name,
  theme_color: colorOptions[0].bg,
  sections: [
    {
      id: 1,
      title: "New Section",
      lessons: []
    }
  ]
};


export interface CourseBuilderClientProps {
  isNew?: boolean;
  courseId?: string;
  initialData?: CourseBuilderResult;
  categories: Category[];
}

// --- Main Component ---
export default function CourseBuilderClient({
  isNew = false,
  courseId,
  initialData,
  categories
}: CourseBuilderClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [expandedCurriculum, setExpandedCurriculum] = useState<number[]>([0]);
  const [courseData, setCourseData] = useState<CourseBuilderResult>(initialData || defaultCourseData);
  const [isSaving, setIsSaving] = useState(false);

  // --- Handlers ---
  const toggleCurriculum = (index: number) => {
    setExpandedCurriculum(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const addCurriculum = () => {
    const newSection: CourseBuilderSection = {
      id: Date.now(),
      title: 'New Section',
      lessons: []
    };

    setCourseData(prev => {
      const newCurriculum = [...prev.sections, newSection];
      setExpandedCurriculum(ex => [...ex, newCurriculum.length - 1]);
      return { ...prev, sections: newCurriculum };
    });
  };

  const addLesson = (sectionIndex: number) => {
    const newLesson: CourseBuilderLesson = {
      id: Date.now(),
      title: `Lesson ${courseData.sections[sectionIndex].lessons.length + 1}`,
      type: 'video',
      duration: 15,
      xp: 50
    };

    setCourseData(prev => {
      const newCurriculum = prev.sections.map((section, idx) => {
        if (idx === sectionIndex) {
          return { ...section, lessons: [...section.lessons, newLesson] };
        }
        return section;
      });
      return { ...prev, sections: newCurriculum };
    });
  };

  const deleteSection = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const deleteLesson = (sectionIndex: number, lessonId: string | number) => {
    setCourseData(prev => {
      const newCurriculum = prev.sections.map((section, idx) => {
        if (idx === sectionIndex) {
          return {
            ...section,
            lessons: section.lessons.filter(l => l.id !== lessonId)
          };
        }
        return section;
      });
      return { ...prev, sections: newCurriculum };
    });
  };

  const updateSectionTitle = (currIndex: number, newTitle: string) => {
    setCourseData(prev => ({
      ...prev,
      sections: prev.sections.map((s, idx) =>
        idx === currIndex ? { ...s, title: newTitle } : s
      )
    }));
  };

  const handleSaveCourse = async () => {
    setIsSaving(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (isNew) {
        // In a real app, you would get the newly created courseId from the API response
        const newCourseId = "1";
        router.push(`/admin/courses/${newCourseId}`);
      } else {
        alert("Course updated successfully!");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save course");
    } finally {
      setIsSaving(false);
    }
  };

  const totalLessons = courseData.sections.reduce(
    (sum, section) => sum + section.lessons.length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <Header
          isNew={isNew}
          isSaving={isSaving}
          onSave={handleSaveCourse}
        />

        <ProgressSteps step={step} setStep={setStep} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <CourseInfoStep
              key="step1"
              courseData={courseData}
              setCourseData={setCourseData}
              categories={categories}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <CurriculumStep
              key="step2"
              isNew={isNew}
              courseId={courseId!}
              courseData={courseData}
              expandedCurriculum={expandedCurriculum}
              totalLessons={totalLessons}
              onToggleCurriculum={toggleCurriculum}
              onAddCurriculum={addCurriculum}
              onAddLesson={addLesson}
              onDeleteSection={deleteSection}
              onDeleteLesson={deleteLesson}
              onUpdateSectionTitle={updateSectionTitle}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <QuizStep
              key="step3"
              isNew={isNew}
              courseId={courseId!}
              courseData={courseData}
              isSaving={isSaving}
              onBack={() => setStep(2)}
              onSave={handleSaveCourse}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

