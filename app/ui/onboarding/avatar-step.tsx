'use client';
import { Camera, Upload, Check, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";

const DEFAULT_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
];

interface AvatarStepProps {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  onBack: () => void;
  onFinish: () => void;
  isLoading: boolean;
}

export function AvatarStep({ avatarUrl, setAvatarUrl, onBack, onFinish, isLoading }: AvatarStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center h-full"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-violet-100 shadow-xl mb-4 bg-gray-50 flex items-center justify-center">
            <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-4 right-0 bg-violet-600 text-white p-2 rounded-full shadow-lg hover:bg-violet-700 transition-colors border-2 border-white"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleAvatarUpload}
          />
        </div>
        <p className="text-sm font-medium text-gray-500">Pick a character or upload your own</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-10">
        {DEFAULT_AVATARS.map((url, idx) => (
          <button
            key={idx}
            onClick={() => setAvatarUrl(url)}
            className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all hover:scale-110 ${avatarUrl === url ? 'border-violet-600 ring-4 ring-violet-100' : 'border-gray-100'
              }`}
          >
            <img src={url} alt={`Avatar ${idx}`} className="w-full h-full" />
          </button>
        ))}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-14 h-14 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-violet-400 hover:text-violet-500 transition-all hover:scale-110"
        >
          <Upload className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-auto w-full max-w-lg flex gap-4">
        <button
          onClick={onBack}
          className="px-8 py-4 rounded-2xl border-2 border-gray-100 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onFinish}
          disabled={isLoading}
          className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-violet-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70"
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
