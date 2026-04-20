'use client';

import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name: string; 
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  // Chuyển kebab-case (book-open) sang PascalCase (BookOpen) nếu cần
  const pascalName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') as keyof typeof Icons;

  const IconComponent = Icons[pascalName] as React.ElementType;

  if (!IconComponent) {
    return <Icons.HelpCircle {...props} />; // Icon mặc định nếu không tìm thấy
  }

  return <IconComponent {...props} />;
};