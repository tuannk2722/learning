import { CourseBuilderResult } from "@/app/lib/definitions/lessons";

export const iconOptions = [
  { name: "atom", icon: 'atom' },
  { name: "zap", icon: 'zap' },
  { name: "code2", icon: 'code2' },
  { name: "brain", icon: 'brain' },
  { name: "palette", icon: 'palette' },
  { name: "database", icon: 'database' },
  { name: "rocket", icon: 'rocket' },
  { name: "star", icon: 'star' },
  { name: "globe", icon: 'globe' },
  { name: "smartphone", icon: 'smartphone' },
  { name: "shield", icon: 'shield' },
  { name: "box", icon: 'box' },
  { name: "cloud", icon: 'cloud' },
  { name: "cpu", icon: 'cpu' },
];

export const levels = ['Beginner', 'Intermediate', 'Advanced'];

export const colorOptions = [
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

export const defaultCourseData: CourseBuilderResult = {
  id: -1,
  name: '',
  description: '',
  category_id: 1,
  category_name: 'Web Development',
  level: levels[0],
  icon: iconOptions[0].name,
  theme_color: colorOptions[0].bg,
  status: 'draft',
  sections: [
    {
      id: -Date.now(),
      title: "New Section",
      lessons: []
    }
  ]
};

export const steps = [
  { num: 1, label: 'Basic Info' },
  { num: 2, label: 'Curriculum' },
  { num: 3, label: 'Quiz' }
];