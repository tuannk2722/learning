
type AchievementsCardProps = {
  icon: React.ReactNode;
  title: string;
};


export function AchievementsCard({ icon, title }: AchievementsCardProps) {
  return (
    <div className="relative bg-white rounded-xl p-6 border border-gray-200 shadow-sm transition-all cursor-pointer">
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center mb-3">
        {icon}
      </div>

      {/* Title */}
      <p className="text-sm">
        {title}
      </p>
    </div>
  );
}