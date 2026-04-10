
type LearningCardProps = {
  icon: React.ReactNode;
  title: string;
  time: number; // ví dụ: 12.5
  learnedLessons: number; // ví dụ: 8
  totalLessons: number; // ví dụ: 16
  progress: number; // 0 -> 100
  color: 'blue' | 'purple' | 'green' | 'orange';
};

const colorMap = {
  blue: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
    progress: 'bg-blue-500',
  },
  purple: {
    bg: 'bg-purple-100',
    icon: 'text-purple-600',
    progress: 'bg-purple-500',
  },
  green: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
    progress: 'bg-green-500',
  },
  orange: {
    bg: 'bg-orange-100',
    icon: 'text-orange-600',
    progress: 'bg-orange-500',
  },
};

export function LearningCard({
  icon,
  title,
  time,
  learnedLessons,
  totalLessons,
  progress,
  color,
}: LearningCardProps) {
  const style = colorMap[color];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition">
      
      {/* Top */}
      <div className="flex items-start justify-between">
        
        {/* Icon */}
        <div className={`p-3 rounded-xl ${style.bg}`}>
          <div className={`h-6 w-6 ${style.icon}`}>
            {icon}
          </div>
        </div>

        {/* Time */}
        <span className="text-sm text-gray-500">{time}h</span>
      </div>

      {/* Title */}
      <h3 className="mt-4 text-base font-semibold text-gray-800">
        {title}
      </h3>

      {/* Lessons */}
      <p className="text-sm text-gray-500 mt-1">
        {learnedLessons}/{totalLessons} Lessons
      </p>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>

        <div className="h-2 w-full bg-gray-100 rounded-full">
          <div
            className={`h-2 rounded-full ${style.progress}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}