'use client';
import { Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { updateOnboarding } from "@/app/lib/actions/users";
import { ProfileStep } from "./profile-step";
import { AvatarStep } from "./avatar-step";
import { SuccessStep } from "./success-step";

const DEFAULT_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
];

export function OnboardingWizard({ user }: { user: any }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nickname: user?.name || "",
    bio: "",
    location: "",
    avatarUrl: DEFAULT_AVATARS[0]
  });

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const result = await updateOnboarding(user.id, {
        name: formData.nickname,
        bio: formData.bio,
        location: formData.location,
        avatar_url: formData.avatarUrl
      });

      setIsLoading(false);
      if (result.success) {
        setStep(3);
      } else {
        alert(result.error || "Failed to update profile.");
      }
    } catch (err) {
      setIsLoading(false);
      alert("An error occurred. Please try again.");
    }
  };

  const handleFinish = () => {
    window.location.href = '/dashboard/courses';
  };

  return (
    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] overflow-hidden relative min-h-[550px] flex flex-col border border-gray-100 z-10">

      {/* Header and Progress */}
      {step < 3 && (
        <div className="mb-10 text-center relative z-20">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Gamified Learning
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-4 max-w-md mx-auto">
            <motion.div
              className="bg-violet-600 h-full rounded-full"
              initial={{ width: `${((step - 1) / 2) * 100}%` }}
              animate={{ width: `${(step / 2) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 1 ? "Tell us about yourself" : "Express yourself"}
          </h2>
          <p className="text-gray-500">
            {step === 1 ? "Help us customize your profile." : "Choose an avatar or upload your own photo."}
          </p>
        </div>
      )}

      <div className="flex-1 flex flex-col relative z-20">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <ProfileStep
              formData={formData}
              setFormData={setFormData}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <AvatarStep
              avatarUrl={formData.avatarUrl}
              setAvatarUrl={(url) => setFormData({ ...formData, avatarUrl: url })}
              nickname={formData.nickname}
              onBack={() => setStep(1)}
              onFinish={handleUpdateProfile}
              isLoading={isLoading}
            />
          )}

          {step === 3 && (
            <SuccessStep
              nickname={formData.nickname}
              avatarUrl={formData.avatarUrl}
              onFinish={handleFinish}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
