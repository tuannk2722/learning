import { ProfileTitle } from '@/app/ui/profile/title';
import { ProfileHeader } from '@/app/ui/profile/header';
import { ProfileStatsGrid } from '@/app/ui/profile/stats-grid';
import { ProfileSetting } from '@/app/ui/profile/setting';
import { Suspense } from 'react';
import { ProfileHeaderSkeleton, ProfileStatsGridSkeleton, ProfileSettingSkeleton } from '@/app/ui/skeletons';

export default function Profile() {
  const userInfo = {
    name: 'You',
    email: 'student@studyhub.com',
    joinDate: '2026-01-15',
    location: 'San Francisco, CA',
    bio: 'Passionate learner exploring mathematics, physics, and chemistry. Always curious about the world around us.',
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Profile Title */}
        <ProfileTitle />

        {/* Profile Header */}
        <Suspense fallback={<ProfileHeaderSkeleton />}>
          <ProfileHeader userInfo={userInfo} />
        </Suspense>

        {/* Stats Grid */}
        <Suspense fallback={<ProfileStatsGridSkeleton />}>
          <ProfileStatsGrid />
        </Suspense>

        {/* Settings Section */}
        <Suspense fallback={<ProfileSettingSkeleton />}>
          <ProfileSetting />
        </Suspense>

      </div>
    </div>
  );
}
