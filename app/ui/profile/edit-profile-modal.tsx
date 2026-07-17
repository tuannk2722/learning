'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Loader2 } from 'lucide-react';
import { User } from '@/app/lib/definitions/user';
import { updateUserProfile } from '@/app/lib/actions/users';
import { toast } from 'sonner';

import { AvatarSelector } from '@/app/ui/avatar-selector';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: User;
}

export function EditProfileModal({ isOpen, onClose, userInfo }: EditProfileModalProps) {
  const [name, setName] = useState(userInfo.name || '');
  const [bio, setBio] = useState(userInfo.bio || '');
  const [location, setLocation] = useState(userInfo.location || '');
  const [avatarUrl, setAvatarUrl] = useState(userInfo.avatar_url || '');

  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateUserProfile(userInfo.id, {
        name,
        bio: bio || null,
        location: location || null,
        avatar_url: avatarUrl || null,
      });

      if (result.success) {
        toast.success('Profile updated successfully!');
        onClose();
      } else {
        toast.error(result.error || 'Failed to update profile.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="edit-profile-modal-root" className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
          {/* Loading backdrop overlay */}
          {isLoading && (
            <div className="fixed inset-0 z-[99999] bg-white/10 backdrop-blur-sm cursor-wait" />
          )}

          {/* Modal Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-0"
            onClick={onClose}
          />

          {/* Modal content box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">

                <AvatarSelector
                  avatarUrl={avatarUrl}
                  setAvatarUrl={setAvatarUrl}
                  nickname={name}
                  onUploadingChange={setIsUploading}
                />

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Display Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button
                type="button"
                onClick={onClose}
                disabled={!name.trim() || !bio.trim() || !location.trim()}
                className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                form="edit-profile-form"
                type="submit"
                disabled={!name.trim() || !bio.trim() || !location.trim()}
                className="px-6 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:hover:bg-violet-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
