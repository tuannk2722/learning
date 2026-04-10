import { OverviewCard } from '@/app/ui/dashboard/overview';
import { BeakerIcon, BookOpenIcon, CalculatorIcon, CheckBadgeIcon, CursorArrowRaysIcon, FireIcon, GlobeAltIcon, StarIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { Header } from '../ui/dashboard/header';
import { LearningCard } from '../ui/dashboard/learning';
import { AchievementsCard } from '../ui/dashboard/achievements';
import Recent_Activity from '@/app/ui/dashboard/recent-activity';

export default async function Page() {

    return (
        <main>
            <h1 className='text-5xl mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold' >
                Study Dashboard
            </h1>
            <p className='text-md text-slate-500 mt-1 mb-10'>
                Keep learning, keep growing!
            </p>
            <Header />

            <div className="mt-6 grid gap-6 sm:grid-cols-3 lg:grid-cols-3">
                <OverviewCard type='Day Streak' value={0} title="Day Streak" />
                <OverviewCard type='Total Study Time' value={0} title="Total Study Time" />
                <OverviewCard type='Sessions Completed' value={0} title="Sessions Completed" />
            </div>

            <div className="mt-6 flex items-center text-lg font-medium">
                <BookOpenIcon className="h-5 w-5 text-gray-500 mr-2" />
                Continue Learning
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <LearningCard
                    icon={<CalculatorIcon className="h-5 w-5 text-gray-500" />}
                    title="Advanced Calculus"
                    time={15}
                    learnedLessons={23}
                    totalLessons={60}
                    progress={100}
                    color="blue"
                />
                <LearningCard
                    icon={<GlobeAltIcon className="h-5 w-5 text-gray-500" />}
                    title="Quantum Physics"
                    time={0}
                    learnedLessons={23}
                    totalLessons={60}
                    progress={5}
                    color="purple"
                />
                <LearningCard
                    icon={<BeakerIcon className="h-5 w-5 text-gray-500" />}
                    title="Organic Chemistry"
                    time={0}
                    learnedLessons={23}
                    totalLessons={60}
                    progress={30}
                    color="green"
                />
                <LearningCard
                    icon={<GlobeAltIcon className="h-5 w-5 text-gray-500" />}
                    title="Total Customers"
                    time={0}
                    learnedLessons={23}
                    totalLessons={60}
                    progress={30}
                    color="orange"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                <div>
                    <div className='flex items-center gap-2 mb-4' >
                        <CheckBadgeIcon className="h-5 w-5 text-black-500 mr-2" />
                        <h3 className='text-xl'>Achievements</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <AchievementsCard
                            icon={<FireIcon className="h-5 w-5 text-gray-500 lucide lucide-flame w-6 h-6 text-orange-500" />}
                            title="Longest Streak: 15 Days"
                        />
                        <AchievementsCard
                            icon={<TrophyIcon className="h-5 w-5 text-gray-500 lucide lucide-flame w-6 h-6 text-yellow-700" />}
                            title="Quantity Badege: "
                        />
                    </div>
                </div>
                <div>
                    <div className='flex items-center gap-2 mb-4' >
                        <CursorArrowRaysIcon className="h-5 w-5 text-black-500 mr-2" />
                        <h3 className='text-xl'>Recent Activity</h3>
                    </div>
                    <div className='space-y-3'>
                        <Recent_Activity />
                    </div>
                </div>
            </div>
        </main>
    );
}