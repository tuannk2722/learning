import { create } from 'zustand';
import { CourseBuilderResult } from '@/app/lib/definitions/lessons';
import { defaultCourseData } from './course-types';

interface CourseBuilderState {
  courseData: CourseBuilderResult;
  originalData: CourseBuilderResult;
  expandedCurriculum: number[];
  isDirty: boolean;
  isSaving: boolean;
  step: number;
  courseId: string | number | null;

  initCourse: (initialData: CourseBuilderResult | undefined) => void;
  setStep: (step: number) => void;
  setCourseId: (id: string | number | null) => void;
  setIsSaving: (isSaving: boolean) => void;
  setIsDirty: (isDirty: boolean) => void;
  toggleCurriculum: (index: number) => void;
  setExpandedCurriculum: (indexes: number[]) => void;
  updateCourseData: (updater: CourseBuilderResult | ((prev: CourseBuilderResult) => CourseBuilderResult)) => void;
  revertAll: () => void;
}

export const useCourseBuilderStore = create<CourseBuilderState>((set) => ({
  courseData: defaultCourseData,
  originalData: defaultCourseData,
  expandedCurriculum: [0],
  isDirty: false,
  isSaving: false,
  step: 1,
  courseId: null,

  initCourse: (initialData) => set(() => {
    const data = initialData || defaultCourseData;
    return {
      courseData: data,
      originalData: data,
      courseId: initialData?.id ?? null,
      isDirty: false,
      isSaving: false,
      step: 1,
      expandedCurriculum: [0],
    };
  }),

  setStep: (step) => set({ step }),
  setCourseId: (courseId) => set({ courseId }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setIsDirty: (isDirty) => set({ isDirty }),

  toggleCurriculum: (index) => set((state) => ({
    expandedCurriculum: state.expandedCurriculum.includes(index)
      ? state.expandedCurriculum.filter(i => i !== index)
      : [...state.expandedCurriculum, index]
  })),

  setExpandedCurriculum: (expandedCurriculum) => set({ expandedCurriculum }),

  updateCourseData: (updater) => set((state) => {
    const newCourseData = typeof updater === 'function'
      ? (updater as (prev: CourseBuilderResult) => CourseBuilderResult)(state.courseData)
      : updater;

    return {
      courseData: newCourseData,
      isDirty: true,
    };
  }),

  revertAll: () => set((state) => ({
    courseData: state.originalData,
    isDirty: false,
  })),
}));
