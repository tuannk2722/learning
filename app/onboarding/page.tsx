import { OnboardingWizard } from '@/app/ui/onboarding/onboarding-wizard';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <OnboardingWizard user={session.user} />
      </div>
    </div>
  );
}
