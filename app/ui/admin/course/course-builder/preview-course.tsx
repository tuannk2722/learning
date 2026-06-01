import { DynamicIcon } from '../../../dynamic-icon';
import { getColorClasses } from '@/app/lib/utils/color-palette';
import { useCourseBuilderStore } from './course-store';

export function CoursePreview() {
  const { courseData } = useCourseBuilderStore();
  const { bg, text } = getColorClasses(courseData.theme_color);

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Live Preview</div>
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-2xl shadow-indigo-100/50 group transition-all hover:shadow-indigo-200/50 hover:-translate-y-1">
          <div className={`w-20 h-20 ${bg} rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-200/20 group-hover:scale-110 transition-transform duration-500`}>
            {courseData.icon && (() => {
              return <DynamicIcon name={courseData.icon} className={`w-10 h-10 ${text}`} />;
            })()}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-400">
              {courseData.category_name || "Category"}
            </span>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${bg} ${text} border border-gray-50`}>
              {courseData.level}
            </span>
          </div>

          <div className="space-y-3 mb-8">
            <h4 className="text-2xl font-black text-gray-900 leading-tight">
              {courseData.name || "Course Name"}
            </h4>
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
              {courseData.description || "Course description will appear here..."}
            </p>
          </div>

          <div className="pt-8 border-t border-gray-50">
            <button className={`w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg hover:brightness-95 transition-all active:scale-[0.98]`}>
              Start Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}