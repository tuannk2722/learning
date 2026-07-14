import { ProfileTitle } from '@/app/ui/profile/title';
import { ProfileHeader } from '@/app/ui/profile/header';
import { ProfileSetting } from '@/app/ui/profile/setting';
import { Suspense } from 'react';
import { ProfileHeaderSkeleton, ProfileSettingSkeleton } from '@/app/ui/skeleton/skeletons';
import { auth } from "@/auth";
import { getUserById } from "@/app/lib/data/users";
import { LogoutProvider } from '@/app/ui/profile/logout-context';

export default async function Profile() {
  const session = await auth();
  const user_id = session?.user?.id;

  const userInfo = await getUserById(user_id!);

  if (!userInfo) {
    return <div>Error loading user data</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-5 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Profile Title */}
          <ProfileTitle />

          {/* LogoutProvider shares isLoggingOut state between ProfileHeader and ProfileSetting */}
          <LogoutProvider>
            {/* Profile Header */}
            <Suspense fallback={<ProfileHeaderSkeleton />}>
              <ProfileHeader userInfo={userInfo} />
            </Suspense>

            {/* Settings Section */}
            <Suspense fallback={<ProfileSettingSkeleton />}>
              <ProfileSetting />
            </Suspense>
          </LogoutProvider>

        </div>
      </div>
    </div>
  );
}
