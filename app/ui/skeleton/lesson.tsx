import { shimmer } from "./skeletons";
import { CurriculumSkeleton } from "./course-detail";

export function LessonContentSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Markdown Content Card */}
      <div className={`${shimmer} bg-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-violet-100/50 relative overflow-hidden`}>
        <div className="space-y-4">
          <div className="h-6 w-3/4 bg-gray-200 rounded" />
          <div className="h-5 w-full bg-gray-200 rounded" />
          <div className="h-5 w-[92%] bg-gray-200 rounded" />
          <div className="h-5 w-[85%] bg-gray-200 rounded" />
          <div className="h-5 w-[70%] bg-gray-200 rounded" />
        </div>

        {/* Video Placeholder */}
        <div className="my-8 aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-lg" />

        <div className="space-y-4 mt-8">
          <div className="h-6 w-1/2 bg-gray-200 rounded" />
          <div className="h-5 w-full bg-gray-200 rounded" />
          <div className="h-5 w-[95%] bg-gray-200 rounded" />
          <div className="h-5 w-[80%] bg-gray-200 rounded" />
        </div>
      </div>

      {/* Complete Button Footer Card */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100">
        <div className="space-y-2">
          <div className={`${shimmer} h-7 w-48 bg-gray-200 rounded relative overflow-hidden`} />
          <div className={`${shimmer} h-4 w-72 bg-gray-200 rounded relative overflow-hidden`} />
        </div>
        <div className={`${shimmer} px-8 py-7 w-60 bg-gray-200 rounded-xl relative overflow-hidden shrink-0 ml-4`} />
      </div>
    </div>
  );
}

export function LessonNoteSkeleton() {
  return (
    <div className={`${shimmer} bg-yellow-50 rounded-3xl p-8 border-2 border-yellow-200 relative overflow-hidden`}>
      <div className="h-7 w-32 bg-gray-200 rounded mb-4" />
      <div className="w-full h-28 bg-white border-2 border-yellow-300 rounded-xl mb-4" />
      <div className="w-28 h-10 bg-yellow-500/20 rounded-xl" />
    </div>
  );
}

export function LessonDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-24">
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Lesson Content Skeleton */}
              <div className="lg:col-span-2 space-y-8">
                <LessonContentSkeleton />
                <LessonNoteSkeleton />
              </div>

              {/* Curriculum Skeleton */}
              <div className="lg:col-span-1 sticky top-32">
                <CurriculumSkeleton />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
