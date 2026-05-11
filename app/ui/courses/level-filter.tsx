interface Props {
  selectedLevel: string;
  setSelectedLevel: (val: string) => void;
}

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

export const LevelFilter = ({
  selectedLevel, setSelectedLevel
}: Props) => {

  return (
    <section className="pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <label className="block text-sm font-medium text-gray-700 mb-3">Level</label>
        <div className="flex flex-wrap gap-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-xl border-2 transition-all ${selectedLevel === level
                ? "border-violet-500 bg-violet-50 text-violet-700 font-medium"
                : "border-gray-200 hover:border-violet-300 text-gray-700"
                }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};