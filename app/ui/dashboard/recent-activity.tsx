import { ClockIcon } from '@heroicons/react/24/outline';
import { RecentActivity } from '@/app/lib/definitions';

const recentActivity: RecentActivity[] = [
  {
    id: '1',
    name: 'John Doe',
    time: '30',
    exp: '10',
  },
  {
    id: '2',
    name: 'Jane Smith',
    time: '60',
    exp: '45',
  },
];


export default async function Recent_Activity() {
  return (

    recentActivity.map((activity, i) => {
      return (
        <div
          key={activity.id}
          className='bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between'
        >
          <div className="flex items-center gap-3">
            <div className='w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center'>
              <ClockIcon className="lucide lucide-circle-check w-5 h-5 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold md:text-base">
                {activity.name}
              </p>
              <p className="hidden text-sm text-gray-500 sm:block">
                {activity.time} minutes ago
              </p>
            </div>
          </div>
          <p
            className='text-sm text-green-600'
          >
            +{activity.exp} XP
          </p>
        </div>
      );
    })
  );
}