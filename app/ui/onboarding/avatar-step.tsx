'use client';
import { Check, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AvatarSelector } from "@/app/ui/avatar-selector";

interface AvatarStepProps {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  nickname: string;
  onBack: () => void;
  onFinish: () => void;
  isLoading: boolean;
}

export function AvatarStep({ avatarUrl, setAvatarUrl, nickname, onBack, onFinish, isLoading }: AvatarStepProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center h-full"
    >
      <div className="mb-8 w-full flex flex-col items-center">
        <AvatarSelector
          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}
          nickname={nickname}
          isLoading={isLoading}
          onUploadingChange={setIsUploading}
        />
        <p className="text-sm font-medium text-gray-500 mt-4 text-center">Pick a character or upload your own</p>
      </div>

      <div className="mt-auto w-full max-w-lg flex gap-4">
        <button
          disabled={isLoading || isUploading}
          onClick={onBack}
          className="px-8 py-4 rounded-2xl border-2 border-gray-100 font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={onFinish}
          disabled={isLoading || isUploading}
          className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-violet-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving Profile...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Finish Setup
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
