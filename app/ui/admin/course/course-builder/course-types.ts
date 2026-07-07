import { CourseBuilderResult } from '@/app/lib/definitions/lessons';
import { COLOR_PALETTE } from '@/app/lib/utils/color-palette';

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


export const defaultCourseData: CourseBuilderResult = {
  id: -1,
  name: '',
  description: '',
  category_name: '',
  level: levels[0],
  icon: iconOptions[0].name,
  theme_color: COLOR_PALETTE[0].name,
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