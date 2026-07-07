'use client';

import { Camera, Upload, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { uploadAvatar } from "@/app/lib/actions/upload";
import { toast } from "sonner";

export const DEFAULT_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
];

interface AvatarSelectorProps {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  nickname: string;
  onUploadingChange?: (isUploading: boolean) => void;
}

export function AvatarSelector({ avatarUrl, setAvatarUrl, nickname, onUploadingChange }: AvatarSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUploadingChange = (uploading: boolean) => {
    setIsUploading(uploading);
    if (onUploadingChange) onUploadingChange(uploading);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);
    setUploadError(null);
    handleUploadingChange(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadAvatar(formData);

      if (result.success && result.url) {
        setAvatarUrl(result.url);
      } else {
        const errorMsg = result.error || 'Upload failed.';
        setUploadError(errorMsg);
        toast.error(errorMsg);
        setPreviewUrl(null);
      }
    } catch {
      const errorMsg = 'An error occurred during upload.';
      setUploadError(errorMsg);
      toast.error(errorMsg);
      setPreviewUrl(null);
    } finally {
      handleUploadingChange(false);
      URL.revokeObjectURL(blobUrl);
    }
  };

  const displayUrl = previewUrl || avatarUrl;
  const initials = nickname
    ? nickname.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';
  const isDefaultAvatar = DEFAULT_AVATARS.includes(avatarUrl);

  return (
    <div className="flex flex-col items-center">
      <div className="relative group mb-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-violet-100 shadow-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          {displayUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={displayUrl}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-4xl font-bold">{initials}</span>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-1 right-1 bg-violet-600 text-white p-2.5 rounded-full shadow-lg hover:bg-violet-700 transition-colors border-2 border-white disabled:opacity-50"
        >
          <Camera className="w-4 h-4" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleAvatarUpload}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-2">
        {DEFAULT_AVATARS.map((url, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setAvatarUrl(url);
              setPreviewUrl(null);
            }}
            className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all hover:scale-110 flex-shrink-0 ${
              avatarUrl === url && isDefaultAvatar
                ? 'border-violet-600 ring-4 ring-violet-100'
                : 'border-gray-100'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Avatar ${idx}`} className="w-full h-full" />
          </button>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-12 h-12 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-violet-400 hover:text-violet-500 transition-all hover:scale-110 disabled:opacity-50 flex-shrink-0"
        >
          <Upload className="w-5 h-5" />
        </button>
      </div>
      
      {uploadError && (
        <p className="text-sm text-red-500 mt-2">{uploadError}</p>
      )}
    </div>
  );
}
