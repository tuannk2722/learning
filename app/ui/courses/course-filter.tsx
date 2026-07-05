import { Category } from "@/app/lib/definitions/courses";
import { Filter, X } from "lucide-react";

interface Props {
  selectedLevel: string;
  setSelectedLevel: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  categories: Category[];
}

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

export const CourseFilter = ({
  selectedLevel, setSelectedLevel, selectedCategory, setSelectedCategory, categories
}: Props) => {

  return (
    <section className="pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filter</span>
          </div>
          {(selectedCategory !== "All" || selectedLevel !== "All") && (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedLevel("All");
              }}
              className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-xl border-2 transition-all ${selectedCategory === category.name
                    ? "border-violet-500 bg-violet-50 text-violet-700 font-medium"
                    : "border-gray-200 hover:border-violet-300 text-gray-700"
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Levels</label>
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