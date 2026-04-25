// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

// export function CardSkeleton() {
//   return (
//     <div
//       className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
//     >
//       <div className="flex p-4">
//         <div className="h-5 w-5 rounded-md bg-gray-200" />
//         <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
//       </div>
//       <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
//         <div className="h-7 w-20 rounded-md bg-gray-200" />
//       </div>
//     </div>
//   );
// }

// export function CardsSkeleton() {
//   return (
//     <>
//       <CardSkeleton />
//       <CardSkeleton />
//       <CardSkeleton />
//       <CardSkeleton />
//     </>
//   );
// }

export function HeaderDashboardSkeleton() {
  return (
    <div className="mb-12">
      <div className={`${shimmer} h-10 w-96 rounded-md bg-gray-200 mb-3`} />
      <div className={`${shimmer} h-6 w-72 rounded-md bg-gray-200`} />
    </div>
  );
}

export function StatsOverviewCardSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 min-h-[160px]`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-16 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="mt-4 h-3 bg-gray-200 rounded-full w-full" />
    </div>
  );
}

export function StatsOverviewSkeleton() {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-12 relative overflow-hidden">
      <StatsOverviewCardSkeleton />
      <StatsOverviewCardSkeleton />
      <StatsOverviewCardSkeleton />
      <StatsOverviewCardSkeleton />
    </div>
  );
}

export function DailyQuestsSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-200" />
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 w-full">
                <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-4 w-8 bg-gray-200 rounded shrink-0" />
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContinueCoursesSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-3xl p-8 shadow-sm border-2 border-gray-100 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-200" />
          <div className="h-6 w-48 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-5 w-48 bg-gray-200 rounded" />
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full" />
            <div className="h-3 w-24 bg-gray-200 rounded mt-2" />
          </div>
        ))}
      </div>
      <div className="mt-6 w-full py-3 h-12 rounded-xl bg-gray-200" />
    </div>
  );
}

export function AchievementsCardSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200" />
          <div className="h-6 w-40 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50">
            <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeaderboardPreviewSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200" />
          <div className="h-6 w-32 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-12 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="pt-24 pb-12 px-6 w-full">
      <div className="max-w-7xl mx-auto">
        <HeaderDashboardSkeleton />
        <StatsOverviewSkeleton />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DailyQuestsSkeleton />
            <ContinueCoursesSkeleton />
          </div>
          <div className="space-y-8">
            <AchievementsCardSkeleton />
            <LeaderboardPreviewSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {/* Customer Name and Image */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-24 rounded bg-gray-100"></div>
        </div>
      </td>
      {/* Email */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </td>
      {/* Amount */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Date */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Status */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Actions */}
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
        </div>
      </td>
    </tr>
  );
}

export function InvoicesMobileSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
        </div>
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
          <div className="mt-2 h-6 w-24 rounded bg-gray-100"></div>
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded bg-gray-100"></div>
          <div className="h-10 w-10 rounded bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

export function InvoicesTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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

export function Top3PodiumSkeleton() {
  return (
    <div className={`${shimmer} grid grid-cols-3 gap-4 mb-12 relative overflow-hidden`}>
      {/* Second Place */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center pt-12 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 mb-3" />
        <div className="w-8 h-8 rounded-full bg-gray-200 mb-3" />
        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
        <div className="h-5 w-20 bg-gray-200 rounded" />
      </div>
      {/* First Place */}
      <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100 shadow-sm text-center flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 mb-3" />
        <div className="w-20 h-20 rounded-full bg-gray-200 mb-3" />
        <div className="h-5 w-28 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-24 bg-gray-200 rounded" />
      </div>
      {/* Third Place */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center pt-12 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 mb-3" />
        <div className="w-8 h-8 rounded-full bg-gray-200 mb-3" />
        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
        <div className="h-5 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function FullLeaderboardSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm relative`}>
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-gray-200 rounded-full" />
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="space-y-2 text-right flex flex-col items-end">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8 relative overflow-hidden`}>
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 shrink-0" />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2 w-full">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded shrink-0 ml-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-36 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileStatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`${shimmer} bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden`}>
          <div className="w-8 h-8 rounded-lg bg-gray-200 mb-3" />
          <div className="h-6 w-16 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSettingSkeleton() {
  return (
    <div className={`${shimmer} bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden`}>
      <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-48 bg-gray-200 rounded" />
            </div>
            <div className="h-6 w-12 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
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
