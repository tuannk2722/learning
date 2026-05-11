import { ProfileTitle } from '@/app/ui/profile/title';
import { ProfileHeader } from '@/app/ui/profile/header';
import { ProfileSetting } from '@/app/ui/profile/setting';
import { Suspense } from 'react';
import { ProfileHeaderSkeleton, ProfileSettingSkeleton } from '@/app/ui/skeletons';
import { auth } from "@/auth";
import { getUserById } from "@/app/lib/data/users";

export default async function Profile() {
  const session = await auth();
  const user_id = session?.user?.id;

  const userInfo = await getUserById(user_id!);

  if (!userInfo) {
    return <div>Error loading user data</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Profile Title */}
        <ProfileTitle />

        {/* Profile Header */}
        <Suspense fallback={<ProfileHeaderSkeleton />}>
          <ProfileHeader userInfo={userInfo} />
        </Suspense>

        {/* Settings Section */}
        <Suspense fallback={<ProfileSettingSkeleton />}>
          <ProfileSetting />
        </Suspense>

      </div>
    </div>
  );
}
