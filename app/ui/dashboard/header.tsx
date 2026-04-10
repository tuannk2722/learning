import { BoltIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export function Header() {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-sm">
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        
        {/* LEFT */}
        <div>
          {/* Level badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur">
            <BoltIcon className="h-4 w-4" />
            Level 12
          </div>

          {/* Title */}
          <h2 className="mt-6 text-3xl font-semibold">
            Continue Your Journey
          </h2>

          {/* Subtitle */}
          <p className="mt-2 text-white/80">
            You're 660 XP away from level 13
          </p>

          {/* Button */}
          <button className="mt-6 inline-flex items-center gap-2 bg-white text-indigo-600 px-5 py-3 rounded-xl font-medium hover:bg-gray-100 transition">
            Start Learning
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>

        {/* RIGHT */}
        <div className="mt-8 lg:mt-0 w-full lg:w-1/2">
          
          {/* Label */}
          <div className="flex justify-between text-sm text-white/80 mb-2">
            <span>Progress to Level 13</span>
            <span>2340 / 3000 XP</span>
          </div>

          {/* Progress bar */}
          <div className="h-3 w-full bg-white/20 rounded-full">
            <div
              className="h-3 rounded-full bg-yellow-400"
              style={{ width: '18%' }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}