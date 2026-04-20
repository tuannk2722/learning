import { categories, levels } from "@/app/lib/courses";
import { Filter, X } from "lucide-react";

interface Props {
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedLevel: string;
  setSelectedLevel: (val: string) => void;
}

export const CourseFilters = ({
  selectedCategory, setSelectedCategory,
  selectedLevel, setSelectedLevel
}: Props) => {
  const activeCount = (selectedCategory !== "All" ? 1 : 0) + (selectedLevel !== "All" ? 1 : 0);

  return (
    <section className="pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Filter className="w-5 h-5" /> Filter
            {activeCount > 0 && (
              <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full">
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && (
            <button
              onClick={() => { setSelectedCategory("All"); setSelectedLevel("All"); }}
              className="text-sm text-violet-600 flex items-center gap-1 hover:underline"
            >
              <X className="w-4 h-4" /> Clear All
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Category Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm border-2 transition-all ${selectedCategory === cat ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-100 hover:border-violet-200"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
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
        </div>
      </div>
    </section>
  );
};