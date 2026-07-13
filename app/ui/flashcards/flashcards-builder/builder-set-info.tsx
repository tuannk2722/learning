'use client';

import { COLOR_PALETTE } from "@/app/lib/utils/color-palette";
import { Globe, Lock } from "lucide-react";
import { motion } from "motion/react";

interface BuilderSetInfoProps {
  title: string;
  description: string;
  isPublic: boolean;
  themeColor: string;
  onTitleChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  setThemeColor: (val: string) => void;
  onTogglePublic: () => void;
}

export function BuilderSetInfo({
  title,
  description,
  isPublic,
  themeColor,
  onTitleChange,
  onDescriptionChange,
  setThemeColor,
  onTogglePublic,
}: BuilderSetInfoProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">

      <div className="mb-5">
        <button
          onClick={onTogglePublic}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${isPublic
            ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
        >
          {isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          {isPublic ? "Public" : "Private"}
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Set Title <span className="text-red-400">*</span>
        </label>
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter a title for this set..."
            className="w-full px-4 py-3 text-lg text-gray-900 bg-transparent rounded-xl focus:outline-none placeholder:text-gray-300 placeholder:font-normal"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Description
        </label>
        <div>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Add a description..."
            rows={2}
            className="w-full px-4 py-3 text-sm text-gray-700 bg-transparent rounded-xl focus:outline-none resize-none placeholder:text-gray-300"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Tags
        </label>
        <div>
          <input
            type="text"
            placeholder="Write tags with commas"
            // value={tags}
            // onChange={(e) => onTagsChange(e.target.value)}
            className="w-full px-4 py-3 text-sm text-gray-700 bg-transparent rounded-xl focus:outline-none resize-none placeholder:text-gray-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Theme Color
        </label>
        <div>
          <div className="grid grid-cols-10 gap-2">
            {COLOR_PALETTE.map((option) => (
              <button
                key={option.name}
                className={`w-10 h-10 rounded-full ${option.bg} border-2 ${themeColor === option.name
                  ? "border-violet-500"
                  : "border-gray-200 hover:border-violet-300"
                  }`}
                type='button'
                onClick={() => setThemeColor(option.name)}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
