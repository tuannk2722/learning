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
  Cpu
} from 'lucide-react';
import Link from 'next/link';


export default function CourseBuilder() {
  const [step, setStep] = useState(1);
  const [expandedCurriculum, setExpandedCurriculum] = useState<number[]>([0]);
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    category: 'Mathematics',
    level: 'Beginner',
    icon: '',
    theme_color: '#4F46E5',
    text_color: '#FFFFFF',
    duration: '',
    curriculum: [] as any[]
  });

  const [curriculum, setCurriculum] = useState([
    {
      id: 1,
      title: 'Introduction',
      lessons: [
        { id: 1, title: 'Getting Started', type: 'lesson', duration: 15, xp: 50 },
        { id: 2, title: 'Basic Concepts Quiz', type: 'quiz', questions: 5, xp: 30 }
      ]
    }
  ]);

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

  const toggleCurriculum = (index: number) => {
    setExpandedCurriculum(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const addCurriculum = () => {
    setCurriculum([...curriculum, {
      id: curriculum.length + 1,
      title: 'New Section',
      lessons: []
    }]);
  };

  const addLesson = (curriculumIndex: number) => {
    const newCurriculum = [...curriculum];
    newCurriculum[curriculumIndex].lessons.push({
      id: newCurriculum[curriculumIndex].lessons.length + 1,
      title: 'New Lesson',
      type: 'lesson',
      duration: 10,
      xp: 50
    });
    setCurriculum(newCurriculum);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 mt-20">
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
                    {s === 1 ? 'Basic Info' : s === 2 ? 'Curriculum' : 'Settings'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
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
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
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
                    {curriculum.map((section, currIndex) => (
                      <div key={section.id} className="border border-gray-200 rounded-lg">
                        <div
                          onClick={() => toggleCurriculum(currIndex)}
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50"
                        >
                          <div className="flex items-center gap-3">
                            <GripVertical className="w-5 h-5 text-gray-400" />
                            {expandedCurriculum.includes(currIndex) ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                            <input
                              type="text"
                              value={section.title}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                const newCurriculum = [...curriculum];
                                newCurriculum[currIndex].title = e.target.value;
                                setCurriculum(newCurriculum);
                              }}
                              className="font-medium px-2 py-1 rounded hover:bg-white border border-transparent hover:border-gray-200 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{section.lessons.length} items</span>
                        </div>

                        {expandedCurriculum.includes(currIndex) && (
                          <div className="p-4 pt-0 space-y-2">
                            {section.lessons.map((lesson) => (
                              <div key={lesson.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <GripVertical className="w-4 h-4 text-gray-400" />
                                {lesson.type === 'lesson' ? (
                                  <FileText className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <BookOpen className="w-4 h-4 text-purple-600" />
                                )}
                                <div className="flex-1">
                                  <div className="font-medium">{lesson.title}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {'duration' in lesson ? `${lesson.duration} min` : `${lesson.questions} questions`} • {lesson.xp} XP
                                  </div>
                                </div>
                                <Link href="/admin/lesson-builder">
                                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-white">
                                    Edit
                                  </button>
                                </Link>
                              </div>
                            ))}

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              onClick={() => addLesson(currIndex)}
                              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 text-sm text-muted-foreground hover:text-indigo-600 flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add Lesson or Quiz
                            </motion.button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(1)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(3)}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Next: Settings
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-2xl font-bold mb-6">Course Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Estimated Duration</label>
                      <input
                        type="text"
                        placeholder="e.g., 8 hours"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 rounded" />
                        <span>Publish immediately</span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <span>Enable discussions</span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <span>Award certificate on completion</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(2)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Create Course
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preview Sidebar */}
          {/* Course Card Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-6">
              <div className={`w-16 h-16 rounded-2xl ${courseData.theme_color} flex items-center justify-center mb-4 shadow-lg`}>
                {courseData.icon && (() => {
                  const Icon = iconOptions.find(i => i.name === courseData.icon)?.icon;
                  return Icon ? <Icon className={`w-8 h-8 ${courseData.text_color}`} /> : null;
                })()}
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">{courseData.category}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100">
                    {courseData.level}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {courseData.name || "Course Name"}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {courseData.description || "Course description will appear here..."}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">0 lessons</span>
                  <span className="text-gray-600">0 XP</span>
                </div>

                <button className={`w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium`}>
                  Start Learning
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
