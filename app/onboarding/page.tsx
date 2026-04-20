import { OnboardingWizard } from '@/app/ui/onboarding/onboarding-wizard';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <OnboardingWizard />
      </div>
    </div>
  );
}
