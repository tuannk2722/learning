import {
  Code2, Brain, Palette, Database, Rocket, Star,
  Globe, Smartphone, Shield, Box, Cloud, Cpu
} from 'lucide-react';

export const iconOptions = [
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

export const categories = [
  'Mathematics', 'Physics', 'Chemistry', 'History', 
  'Computer Science', 'Art', 'Language'
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

export interface Lesson {
  id: string | number;
  title: string;
  type: string;
  duration: number;
  xp: number;
}

export interface Section {
  id: string | number;
  title: string;
  lessons: Lesson[];
}

export interface CourseData {
  name: string;
  description: string;
  category: string;
  level: string;
  icon: string;
  theme_color: string;
  text_color: string;
  duration: string;
  curriculum: Section[];
}

export interface CourseBuilderClientProps {
  isNew?: boolean;
  courseId?: string;
  initialData?: CourseData;
}
