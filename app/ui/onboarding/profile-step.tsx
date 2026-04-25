'use client';
import { User, FileText, MapPin, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface ProfileStepProps {
  formData: {
    nickname: string;
    bio: string;
    location: string;
  };
  setFormData: (data: any) => void;
  onNext: () => void;
}

export function ProfileStep({ formData, setFormData, onNext }: ProfileStepProps) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6 w-full max-w-lg mx-auto"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <User className="w-4 h-4 text-violet-500" /> Nickname
        </label>
        <input
          type="text"
          value={formData.nickname}
          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
          placeholder="How should we call you?"
          className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl focus:border-violet-500 focus:outline-none transition-all bg-gray-50/50"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-500" /> Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="A short sentence about yourself..."
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl focus:border-violet-500 focus:outline-none transition-all bg-gray-50/50 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-violet-500" /> Location
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Where are you from?"
          className="w-full px-4 py-3 border-2 border-gray-100 rounded-2xl focus:border-violet-500 focus:outline-none transition-all bg-gray-50/50"
        />
      </div>

      <div className="pt-4">
        <button
          onClick={onNext}
          disabled={!formData.nickname}
          className="w-full py-4 bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group"
        >
          Next Step
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
