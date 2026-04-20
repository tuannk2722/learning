import { ProfileTitle } from '@/app/ui/profile/title';
import { ProfileHeader } from '@/app/ui/profile/header';
import { ProfileStatsGrid } from '@/app/ui/profile/stats-grid';
import { ProfileSetting } from '@/app/ui/profile/setting';

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
        <ProfileHeader userInfo={userInfo} />

        {/* Stats Grid */}
        <ProfileStatsGrid />

        {/* Settings Section */}
        <ProfileSetting />

      </div>
    </div>
  );
}
