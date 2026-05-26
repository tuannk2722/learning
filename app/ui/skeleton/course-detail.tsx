import { shimmer } from "./skeletons";

export function CourseHeroSectionSkeleton() {
  return (
    <section className="pt-32 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Info Skeleton (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div className="text-violet-300 flex items-center gap-1 mb-4 text-sm font-medium">
              ← Return to Courses
            </div>

            <div className="flex items-center gap-4 mb-6">
              {/* Icon Placeholder */}
              <div className={`${shimmer} w-20 h-20 rounded-2xl bg-gray-200 shrink-0 relative overflow-hidden`} />
              <div className="space-y-3 flex-1">
                {/* Level badge */}
                <div className={`${shimmer} px-3 py-1 w-20 h-5 bg-gray-200 rounded-full relative overflow-hidden`} />
                {/* Course Title */}
                <div className={`${shimmer} h-12 w-[80%] bg-gray-200 rounded-lg relative overflow-hidden`} />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 mb-8">
              <div className={`${shimmer} h-5 w-full bg-gray-200 rounded relative overflow-hidden`} />
              <div className={`${shimmer} h-5 w-[90%] bg-gray-200 rounded relative overflow-hidden`} />
              <div className={`${shimmer} h-5 w-[60%] bg-gray-200 rounded relative overflow-hidden`} />
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`${shimmer} w-5 h-5 bg-gray-200 rounded shrink-0 relative overflow-hidden`} />
                  <div className={`${shimmer} h-5 w-24 bg-gray-200 rounded relative overflow-hidden`} />
                </div>
              ))}
            </div>
          </div>

          {/* Enrollment Card Skeleton */}
          <div className="h-fit sticky top-24">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-violet-100">
              <div className="mb-6 space-y-2">
                <div className={`${shimmer} h-8 w-24 bg-gray-200 rounded relative overflow-hidden`} />
                <div className={`${shimmer} h-4 w-40 bg-gray-200 rounded relative overflow-hidden`} />
              </div>

              <div className={`${shimmer} w-full py-7 rounded-xl bg-gray-200 mb-6 relative overflow-hidden`} />

              <div className="space-y-4 pt-6 border-t border-gray-100">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`${shimmer} w-4 h-4 bg-gray-200 rounded-full shrink-0 relative overflow-hidden`} />
                    <div className={`${shimmer} h-4 w-32 bg-gray-200 rounded relative overflow-hidden`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CurriculumSkeleton() {
  return (
    < div className="lg:col-span-2" >
      <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100">
        <div className={`${shimmer} h-8 w-44 bg-gray-200 rounded-lg mb-6 relative overflow-hidden`} />

        <div className="space-y-6">
          {[1, 2].map((sectionIndex) => (
            <div key={sectionIndex} className="border-2 border-gray-200 rounded-2xl overflow-hidden">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-4 border-b-2 border-gray-200">
                <div className={`${shimmer} h-6 w-48 bg-gray-200 rounded mb-2 relative overflow-hidden`} />
                <div className={`${shimmer} h-4 w-32 bg-gray-200 rounded relative overflow-hidden`} />
              </div>

              {/* Lessons list */}
              <div className="divide-y divide-gray-200">
                {[1, 2, 3].map((lessonIndex) => (
                  <div key={lessonIndex} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 w-full">
                      {/* Left icon */}
                      <div className={`${shimmer} w-10 h-10 rounded-xl bg-gray-200 shrink-0 relative overflow-hidden`} />

                      <div className="space-y-2 flex-1">
                        {/* Title */}
                        <div className={`${shimmer} h-5 w-[60%] bg-gray-200 rounded relative overflow-hidden`} />
                        {/* Specs */}
                        <div className="flex gap-4">
                          <div className={`${shimmer} h-4 w-16 bg-gray-200 rounded relative overflow-hidden`} />
                          <div className={`${shimmer} h-4 w-12 bg-gray-200 rounded relative overflow-hidden`} />
                        </div>
                      </div>
                    </div>
                    {/* Chevron right */}
                    <div className={`${shimmer} w-5 h-5 bg-gray-200 rounded shrink-0 relative overflow-hidden`} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div >
  )
}

export function CurriculumSectionSkeleton() {
  return (
    <section className="pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Curriculum Skeleton */}
          <CurriculumSkeleton />

          {/* What You'll Learn Skeleton */}
          <div>
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100 h-fit">
              <div className={`${shimmer} h-7 w-48 bg-gray-200 rounded mb-6 relative overflow-hidden`} />
              <div className="space-y-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`${shimmer} w-5 h-5 bg-gray-200 rounded-full shrink-0 relative overflow-hidden`} />
                    <div className={`${shimmer} h-5 w-[70%] bg-gray-200 rounded relative overflow-hidden`} />
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-gray-200 space-y-4">
                <div className="flex items-center gap-2">
                  <div className={`${shimmer} w-5 h-5 bg-gray-200 rounded shrink-0 relative overflow-hidden`} />
                  <div className={`${shimmer} h-5 w-28 bg-gray-200 rounded relative overflow-hidden`} />
                </div>
                <div className="space-y-2">
                  <div className={`${shimmer} h-4 w-full bg-gray-200 rounded relative overflow-hidden`} />
                  <div className={`${shimmer} h-4 w-[85%] bg-gray-200 rounded relative overflow-hidden`} />
                  <div className={`${shimmer} h-4 w-[75%] bg-gray-200 rounded relative overflow-hidden`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Course Hero Section */}
      <CourseHeroSectionSkeleton />

      {/* Curriculum & What You'll Learn Section */}
      <CurriculumSectionSkeleton />
    </div>
  );
}
