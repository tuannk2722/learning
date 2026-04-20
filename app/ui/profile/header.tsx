'use client';

import { UserInfo } from '@/app/lib/definitions/definitions';
import { Edit2, Mail, Calendar, MapPin } from 'lucide-react';
import { motion } from 'motion/react';


export function ProfileHeader({ userInfo }: { userInfo: UserInfo }) {

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8"
    >
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
          {userInfo.name[0]}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-medium mb-2">{userInfo.name}</h2>
              <p className="text-muted-foreground mb-4">{userInfo.bio}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              {userInfo.email}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Joined {new Date(userInfo.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {userInfo.location}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}