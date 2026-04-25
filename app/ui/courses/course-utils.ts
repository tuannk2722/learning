
export function getCourseColorClasses(colorName: string | undefined | null) {
  const colors: Record<string, { bg: string; text: string; gradient: string }> = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
    },
    cyan: {
      bg: 'bg-cyan-100',
      text: 'text-cyan-600',
      gradient: 'from-cyan-400 to-blue-500',
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      gradient: 'from-orange-500 to-red-500',
    },
    emerald: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-600',
      gradient: 'from-emerald-500 to-teal-500',
    },
    rose: {
      bg: 'bg-rose-100',
      text: 'text-rose-600',
      gradient: 'from-rose-500 to-pink-500',
    },
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
      gradient: 'from-indigo-600 to-purple-600',
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      gradient: 'from-yellow-500 to-orange-500',
    },
    black: {
      bg: 'bg-gray-900',
      text: 'text-white',
      gradient: 'from-gray-900 to-gray-700',
    }
  };

  return colors[colorName as string] || colors.indigo; // Default to indigo if not found
}
