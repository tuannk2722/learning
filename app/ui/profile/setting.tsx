'use client';

import { handleLogout } from '@/app/lib/actions/auth';
import { Settings, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export function ProfileSetting() {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6 text-violet-600" />
        Account Setting
      </h2>

      <div className="space-y-4">

        <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-violet-50 transition-colors group">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-600 group-hover:text-violet-600" />
            <span className="font-medium text-gray-900">Notification Settings</span>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-violet-50 transition-colors group">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-600 group-hover:text-violet-600" />
            <span className="font-medium text-gray-900">Change Password</span>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={() => handleLogout()}
          className="w-full flex items-center justify-between p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-600">Logout</span>
          </div>
        </button>
      </div>
    </motion.div>
  )
}