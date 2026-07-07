'use client';

import { Edit2, Mail, Calendar, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '@/app/lib/definitions/user';
import { useState } from 'react';
import { EditProfileModal } from './edit-profile-modal';

export function ProfileHeader({ userInfo }: { userInfo: User }) {

  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-6 md:p-8 border-2 border-violet-100 shadow-lg mb-8"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden 
                  bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center 
                  text-white text-5xl font-bold flex-shrink-0 
                  border-4 border-white shadow-md">

            {userInfo.avatar_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={userInfo.avatar_url}
                alt={userInfo.name || 'avatar'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>
                {(userInfo.name?.[0] || '?').toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 w-full text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{userInfo.name}</h2>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto md:mx-0">
                  {userInfo.bio || "Describe about yourself..."}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-violet-50 text-violet-700 font-medium border border-violet-100 rounded-xl hover:bg-violet-100 transition-colors w-full md:w-auto flex-shrink-0 mt-2 md:mt-0"
              >
                <Edit2 className="w-4 h-4" />
                Edit profile
              </motion.button>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-y-3 gap-x-6 text-sm mt-6 pt-6 border-t border-gray-100 justify-center md:justify-start">
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-violet-500" />
                {userInfo.email}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-violet-500" />
                Join from {new Date(userInfo.joinDate).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' })}
              </div>
              {userInfo.location && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-violet-500" />
                  {userInfo.location}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <EditProfileModal 
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        userInfo={userInfo}
      />
    </>
  )
}