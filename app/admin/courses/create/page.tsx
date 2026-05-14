"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Save, Eye, Upload, Plus, Trash2,
  GripVertical, BookOpen, ChevronDown, ChevronRight,
  FileText, Image as ImageIcon,
  Code2,
  Brain,
  Palette,
  Database,
  Rocket,
  Star,
  Globe,
  Smartphone,
  Shield,
  Box,
  Cloud,
  Cpu,
  HelpCircle,
  Video,
  Code
} from 'lucide-react';
import Link from 'next/link';


const iconOptions = [
  { name: "Code2", icon: Code2 },
  { name: "Brain", icon: Brain },
  { name: "Palette", icon: Palette },
  { name: "Database", icon: Database },
  { name: "Rocket", icon: Rocket },
  { name: "Star", icon: Star },
  { name: "Globe", icon: Globe },
  { name: "Smartphone", icon: Smartphone },
  { name: "Shield", icon: Shield },
  { name: "Box", icon: Box },
  { name: "Cloud", icon: Cloud },
  { name: "Cpu", icon: Cpu },
];
const categories = ['Mathematics', 'Physics', 'Chemistry', 'History', 'Computer Science', 'Art', 'Language'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];

const colorOptions = [
  { name: "blue", bg: "bg-blue-100", text: "text-blue-600" },
  { name: "purple", bg: "bg-purple-100", text: "text-purple-600" },
  { name: "indigo", bg: "bg-indigo-100", text: "text-indigo-600" },
  { name: "cyan", bg: "bg-cyan-100", text: "text-cyan-600" },
  { name: "pink", bg: "bg-pink-100", text: "text-pink-600" },
  { name: "yellow", bg: "bg-yellow-100", text: "text-yellow-600" },
  { name: "emerald", bg: "bg-emerald-100", text: "text-emerald-600" },
  { name: "red", bg: "bg-red-100", text: "text-red-600" },
  { name: "orange", bg: "bg-orange-100", text: "text-orange-600" },
];

export default function CourseBuilder() {
  const [step, setStep] = useState(1);
  const [expandedCurriculum, setExpandedCurriculum] = useState<number[]>([0]);
  const [courseData, setCourseData] = useState({
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
    ] as any[]
  });

  const toggleCurriculum = (index: number) => {
    setExpandedCurriculum(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const addCurriculum = () => {
    const newSection = {
      id: Date.now(),
      title: 'New Section',
      lessons: []
    };

    setCourseData(prev => {
      const newCurriculum = [...prev.curriculum, newSection];
      // Tự động mở section mới thêm
      setExpandedCurriculum(ex => [...ex, newCurriculum.length - 1]);
      return { ...prev, curriculum: newCurriculum };
    });
  };

  const addLesson = (sectionIndex: number) => {
    const newLesson = {
      id: Date.now(),
      title: `Lesson ${courseData.curriculum[sectionIndex].lessons.length + 1}`,
      type: 'video',
      duration: 15,
      xp: 50
    };

    setCourseData(prev => {
      const newCurriculum = prev.curriculum.map((section: any, idx: number) => {
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
      curriculum: prev.curriculum.filter((_: any, i: number) => i !== index)
    }));
  };

  const deleteLesson = (sectionIndex: number, lessonId: any) => {
    setCourseData(prev => {
      const newCurriculum = prev.curriculum.map((section: any, idx: number) => {
        if (idx === sectionIndex) {
          return {
            ...section,
            lessons: section.lessons.filter((l: any) => l.id !== lessonId)
          };
        }
        return section;
      });
      return { ...prev, curriculum: newCurriculum };
    });
  };

  const totalLessons = courseData.curriculum.reduce((sum: number, section: any) =>
    sum + section.lessons.length, 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/courses">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Create New Course</h1>
              <p className="text-muted-foreground">Build engaging learning experiences</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Course
            </motion.button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setStep(s)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {s}
                </motion.div>
                <div className="ml-3 mr-8">
                  <div className="text-sm font-medium">
                    {s === 1 ? 'Basic Info' : s === 2 ? 'Curriculum' : 'Quiz'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Course Information</h2>

                  <div className="space-y-6">
                    {/* Course Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Course Name *</label>
                      <input
                        type="text"
                        placeholder="e.g., Advanced Calculus"
                        value={courseData.name}
                        onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Description *</label>
                      <textarea
                        rows={4}
                        placeholder="Describe what students will learn in this course..."
                        value={courseData.description}
                        onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Category & Level */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Category *</label>
                        <select
                          value={courseData.category}
                          onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Level *</label>
                        <select
                          value={courseData.level}
                          onChange={(e) => setCourseData({ ...courseData, level: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {levels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Icon Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Course Icon</label>
                      <div className="grid grid-cols-10 gap-2">
                        {iconOptions.map((iconItem) => (
                          <motion.button
                            key={iconItem.name}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCourseData({ ...courseData, icon: iconItem.name })}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-2 ${courseData.icon === iconItem.name ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                              }`}
                          >
                            <iconItem.icon className="w-6 h-6 text-gray-700" />
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Theme Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Theme Color *
                      </label>
                      <div className="grid grid-cols-10 gap-2">
                        {colorOptions.map((option) => (
                          <button
                            key={option.bg}
                            onClick={() => setCourseData({ ...courseData, theme_color: option.bg, text_color: option.text })}
                            className={`p-3 rounded-xl border-2 transition-all ${courseData.theme_color === option.bg
                              ? "border-violet-500"
                              : "border-gray-200 hover:border-violet-300"
                              }`}
                          >
                            <div className={`h-8 rounded-lg ${option.bg}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Next: Curriculum
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Course Card Preview Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Live Preview</div>
                  <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-2xl shadow-indigo-100/50 group transition-all hover:shadow-indigo-200/50 hover:-translate-y-1">
                    {/* Icon Box */}
                    <div className={`w-20 h-20 ${courseData.theme_color} rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-200/20 group-hover:scale-110 transition-transform duration-500`}>
                      {courseData.icon && (() => {
                        const Icon = iconOptions.find(i => i.name === courseData.icon)?.icon;
                        return Icon ? <Icon className={`w-10 h-10 ${courseData.text_color}`} /> : null;
                      })()}
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-sm font-medium text-gray-400">
                        {courseData.category}
                      </span>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${courseData.theme_color} ${courseData.text_color} border border-gray-50`}>
                        {courseData.level}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-3 mb-8">
                      <h4 className="text-2xl font-black text-gray-900 leading-tight">
                        {courseData.name || "Course Name"}
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {courseData.description || "Course description will appear here..."}
                      </p>
                    </div>

                    {/* Divider & Action */}
                    <div className="pt-8 border-t border-gray-50">
                      <button className={`w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:brightness-95 transition-all active:scale-[0.98]`}>
                        Start Learning
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}



          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Course Curriculum</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addCurriculum}
                      className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Section
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {courseData.curriculum.map((section: any, currIndex: number) => (
                        <motion.div
                          key={section.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                        >
                          <div
                            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors border-b border-gray-100"
                            onClick={() => toggleCurriculum(currIndex)}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              {expandedCurriculum.includes(currIndex) ? (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                              )}
                              <input
                                type="text"
                                value={section.title}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  const newTitle = e.target.value;
                                  setCourseData(prev => ({
                                    ...prev,
                                    curriculum: prev.curriculum.map((s, idx) =>
                                      idx === currIndex ? { ...s, title: newTitle } : s
                                    )
                                  }));
                                }}
                                className="font-bold text-gray-900 bg-transparent px-2 py-1 rounded hover:bg-white border border-transparent hover:border-gray-200 focus:outline-none focus:border-indigo-500 w-full"
                              />
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                {section.lessons.length} items
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSection(currIndex);
                                }}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                              >
                                <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                              </button>
                            </div>
                          </div>

                          {expandedCurriculum.includes(currIndex) && (
                            <div className="p-4 space-y-3 bg-slate-50/30">
                              <AnimatePresence mode="popLayout">
                                {section.lessons.map((lesson: any) => (
                                  <motion.div
                                    key={lesson.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all group"
                                  >
                                    <GripVertical className="w-4 h-4 text-gray-300" />
                                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-50">
                                      {lesson.type === 'video' ? (
                                        <Video className="w-5 h-5 text-red-500" />
                                      ) : lesson.type === 'code' ? (
                                        <Code className="w-5 h-5 text-indigo-500" />
                                      ) : (
                                        <FileText className="w-5 h-5 text-blue-500" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold text-gray-900 truncate">{lesson.title}</div>
                                      <div className="text-xs font-bold text-slate-400 uppercase mt-1">
                                        {lesson.type} • {lesson.duration} min • {lesson.xp} XP
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Link href={`/admin/courses/draft/lessons/${lesson.id}`}>
                                        <button className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg hover:bg-slate-50 transition-colors uppercase tracking-wider">
                                          Edit
                                        </button>
                                      </Link>
                                      <button
                                        onClick={() => deleteLesson(currIndex, lesson.id)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group/trash"
                                      >
                                        <Trash2 className="w-4 h-4 text-red-400 group-hover/trash:text-red-600" />
                                      </button>
                                    </div>
                                  </motion.div>
                                ))}
                              </AnimatePresence>

                              <motion.button
                                whileHover={{ scale: 1.01, backgroundColor: '#F8FAFC' }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => addLesson(currIndex)}
                                className="w-full p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-white text-sm font-bold text-slate-400 hover:text-indigo-600 flex items-center justify-center gap-2 transition-all"
                              >
                                <Plus className="w-4 h-4" />
                                ADD LESSON
                              </motion.button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-between mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(1)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(3)}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Next: Quiz
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Summary Sidebar Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 ml-2">Course Summary</h3>

                    <div className="space-y-4">
                      <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100 transition-all hover:shadow-md">
                        <div className="text-[10px] font-bold text-violet-600 uppercase tracking-tight mb-1">Total Sections</div>
                        <div className="text-3xl font-black text-violet-900">{courseData.curriculum.length}</div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 transition-all hover:shadow-md">
                        <div className="text-[10px] font-bold text-blue-600 uppercase tracking-tight mb-1">Total Lessons</div>
                        <div className="text-3xl font-black text-blue-900">{totalLessons}</div>
                      </div>

                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 transition-all hover:shadow-md">
                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight mb-1">Estimated Duration</div>
                        <div className="text-3xl font-black text-emerald-900">
                          {Math.floor(totalLessons * 15 / 60)}h {(totalLessons * 15) % 60}m
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-5 bg-slate-900 rounded-2xl shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                      <div className="flex items-start gap-3 relative z-10">
                        <div className="text-xl">💡</div>
                        <div>
                          <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 tracking-widest">Builder Tip</div>
                          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                            Group related lessons into logical sections to help students navigate their learning journey more effectively.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}



          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto w-full"
            >
              <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-2xl">
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <HelpCircle className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Lesson Quizzes</h2>
                  <p className="text-gray-500 font-medium">Configure assessments to validate student progress</p>
                </div>

                {courseData.curriculum.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-3xl bg-slate-50/50">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6">No sections or lessons found</p>
                    <button
                      onClick={() => setStep(2)}
                      className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      Return to Curriculum
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {courseData.curriculum.map((section: any) => (
                      <div key={section.id} className="bg-slate-50/50 border border-gray-100 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            {section.title}
                          </h3>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{section.lessons.length} lessons</span>
                        </div>
                        <div className="grid gap-3">
                          {section.lessons.map((lesson: any, index: number) => (
                            <div key={lesson.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl group transition-all hover:border-indigo-200 shadow-sm">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                  <HelpCircle className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-gray-900">{lesson.title}</span>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lesson {index + 1}</span>
                                </div>
                              </div>
                              <Link
                                href={`/admin/courses/draft/quiz/${lesson.id}`}
                                className="px-6 py-2 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                              >
                                {index === 0 ? "Create Quiz" : "Edit Quiz"}
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">💡</div>
                    <div>
                      <div className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2">Pro Tips</div>
                      <ul className="text-xs text-indigo-700 space-y-1 font-medium">
                        <li>• Each lesson should have at least one quiz to validate learning.</li>
                        <li>• Mix different question types to keep students engaged.</li>
                        <li>• Set appropriate XP rewards based on the difficulty of the quiz.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
                  <button
                    onClick={() => setStep(2)}
                    className="px-8 py-3 border-2 border-gray-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-gray-500 uppercase tracking-widest text-xs"
                  >
                    Previous
                  </button>
                  <button
                    className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-violet-700 text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-indigo-500/40 transition-all uppercase tracking-widest text-xs"
                  >
                    Finish & Publish Course
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
