import { shimmer } from "./skeletons";

export function CourseCardSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-3 w-1/2 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-8 bg-gray-200 rounded" />
        </div>
        <div className="h-2 bg-gray-200 rounded-full w-full" />
      </div>
      <div className="w-[80%] mx-auto h-10 bg-gray-200 rounded-lg mt-2" />
    </div>
  );
}

export function CoursesSkeleton() {
  return (
    <div className="p-6 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Title Skeleton */}
        <div className="mb-8">
          <div className={`${shimmer} h-10 w-64 bg-gray-200 rounded-lg mb-2`} />
          <div className={`${shimmer} h-4 w-96 bg-gray-200 rounded-lg`} />
        </div>

        {/* Enrolled Courses Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className={`${shimmer} w-5 h-5 bg-gray-200 rounded`} />
            <div className={`${shimmer} h-6 w-48 bg-gray-200 rounded`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        </div>

        {/* Available Courses Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className={`${shimmer} w-5 h-5 bg-gray-200 rounded`} />
            <div className={`${shimmer} h-6 w-48 bg-gray-200 rounded`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AllCoursesSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Search & Header Section Skeleton */}
      <section className="pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="pt-16 mb-4 flex justify-center">
            <div className={`${shimmer} h-10 w-96 bg-gray-200 rounded-lg relative overflow-hidden`} />
          </div>
          <div className="max-w-2xl mx-auto relative mt-8">
            <div className={`${shimmer} w-full h-14 rounded-2xl bg-gray-200 relative overflow-hidden`} />
          </div>
        </div>
      </section>

      {/* Level Filter Skeleton */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`${shimmer} h-5 w-12 bg-gray-200 rounded mb-3 relative overflow-hidden`} />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`${shimmer} w-24 h-10 bg-gray-200 rounded-xl relative overflow-hidden`} />
            ))}
          </div>
        </div>
      </section>

      {/* Course Grid Skeleton */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}