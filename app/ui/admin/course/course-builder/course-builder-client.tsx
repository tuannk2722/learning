"use client";

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';

import { CourseData, Section, Lesson, CourseBuilderClientProps, categories, levels, iconOptions, colorOptions } from './course-types';
import Header from './header';
import ProgressSteps from './progress-steps';
import CourseInfoStep from '../course-info-step';
import CurriculumStep from './curriculum-step';
import QuizStep from './quiz-step';

const defaultCourseData: CourseData = {
  name: '',
  description: '',
  category: categories[0],
  level: levels[0],
  icon: iconOptions[0].name,
  theme_color: colorOptions[0].bg,
  text_color: colorOptions[0].text,
  duration: '',
  curriculum: [
    {
      id: 1,
      title: 'Introduction',
      lessons: [
        { id: 1, title: 'Getting Started', type: 'video', duration: 15, xp: 50 },
        { id: 2, title: 'Basic Concepts', type: 'lesson', duration: 10, xp: 30 }
      ]
    }
  ]
};

// --- Main Component ---
export default function CourseBuilderClient({
  isNew = false,
  courseId = "draft",
  initialData
}: CourseBuilderClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [expandedCurriculum, setExpandedCurriculum] = useState<number[]>([0]);
  const [courseData, setCourseData] = useState<CourseData>(initialData || defaultCourseData);
  const [isSaving, setIsSaving] = useState(false);

  // --- Handlers ---
  const toggleCurriculum = (index: number) => {
    setExpandedCurriculum(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const addCurriculum = () => {
    const newSection: Section = {
      id: Date.now(),
      title: 'New Section',
      lessons: []
    };

    setCourseData(prev => {
      const newCurriculum = [...prev.curriculum, newSection];
      setExpandedCurriculum(ex => [...ex, newCurriculum.length - 1]);
      return { ...prev, curriculum: newCurriculum };
    });
  };

  const addLesson = (sectionIndex: number) => {
    const newLesson: Lesson = {
      id: Date.now(),
      title: `Lesson ${courseData.curriculum[sectionIndex].lessons.length + 1}`,
      type: 'video',
      duration: 15,
      xp: 50
    };

    setCourseData(prev => {
      const newCurriculum = prev.curriculum.map((section, idx) => {
        if (idx === sectionIndex) {
          return { ...section, lessons: [...section.lessons, newLesson] };
        }
        return section;
      });
      return { ...prev, curriculum: newCurriculum };
    });
  };

  const deleteSection = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index)
    }));
  };

  const deleteLesson = (sectionIndex: number, lessonId: string | number) => {
    setCourseData(prev => {
      const newCurriculum = prev.curriculum.map((section, idx) => {
        if (idx === sectionIndex) {
          return {
            ...section,
            lessons: section.lessons.filter(l => l.id !== lessonId)
          };
        }
        return section;
      });
      return { ...prev, curriculum: newCurriculum };
    });
  };

  const updateSectionTitle = (currIndex: number, newTitle: string) => {
    setCourseData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((s, idx) =>
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

  const totalLessons = courseData.curriculum.reduce(
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
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <CurriculumStep
              key="step2"
              isNew={isNew}
              courseId={courseId}
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
              courseId={courseId}
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

