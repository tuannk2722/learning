import { shimmer } from "./skeletons";
import { CurriculumSkeleton } from "./course-detail";

export function LessonDetailHeaderSkeleton() {
  return (
    <div className="bg-white border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Return to Course link */}
        <div className="inline-flex items-center gap-2 mb-4 font-medium">
          <div className={`${shimmer} w-4 h-4 bg-gray-200 rounded shrink-0 relative overflow-hidden`} />
          <div className={`${shimmer} h-5 w-40 bg-gray-200 rounded relative overflow-hidden`} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              {/* Badge */}
              <div className={`${shimmer} px-3 py-1 w-28 h-7 bg-gray-200 rounded-full relative overflow-hidden`} />
              {/* Clock and Duration */}
              <div className={`${shimmer} w-24 h-5 bg-gray-200 rounded relative overflow-hidden`} />
            </div>
            {/* Title */}
            <div className={`${shimmer} h-9 w-[60%] bg-gray-200 rounded-lg relative overflow-hidden`} />
          </div>

          {/* Rating */}
          <div className={`${shimmer} w-28 h-6 bg-gray-200 rounded relative overflow-hidden shrink-0 ml-4`} />
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className={`${shimmer} h-4 w-28 bg-gray-200 rounded relative overflow-hidden`} />
            <div className={`${shimmer} h-4 w-10 bg-gray-200 rounded relative overflow-hidden`} />
          </div>
          <div className={`${shimmer} h-2 bg-gray-200 rounded-full relative overflow-hidden w-full`} />
        </div>
      </div>
    </div>
  );
}

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
    <div className="max-w-4xl mx-auto px-6 pb-12">
      <div className={`${shimmer} mt-8 bg-yellow-50 rounded-3xl p-8 border-2 border-yellow-200 relative overflow-hidden`}>
        <div className="h-7 w-32 bg-gray-200 rounded mb-4" />
        <div className="w-full h-28 bg-white border-2 border-yellow-300 rounded-xl mb-4" />
        <div className="w-28 h-10 bg-yellow-500/20 rounded-xl" />
      </div>
    </div>
  );
}

export function LessonDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-24">
        {/* Lesson Header Skeleton */}
        <LessonDetailHeaderSkeleton />

        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Lesson Content Skeleton */}
              <div className="lg:col-span-2">
                <LessonContentSkeleton />
              </div>

              {/* Curriculum Skeleton */}
              <div className="lg:col-span-1 sticky top-32">
                <CurriculumSkeleton />
              </div>
            </div>
          </div>
        </section>

        {/* Lesson Note Skeleton */}
        <LessonNoteSkeleton />
      </div>
    </div>
  );
}
