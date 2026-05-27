'use client';
import { motion } from 'motion/react';
import { Eye, Ban, Unlock } from 'lucide-react';
import { User } from '@/app/lib/definitions/user';
import { calculateLevel } from '@/app/lib/utils/xp';
import { formatLastActive } from '@/app/lib/utils/active-status';

interface UserRowProps {
  user: User;
  index: number;
}

const isBanned = (user: User) => (user.status || 'active').toLowerCase() === 'banned';

export function UserRow({ user, index }: UserRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.05 }}
      className="hover:bg-slate-50 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-white font-medium text-sm overflow-hidden">
            {user.avatar_url ? (
              user.avatar_url.startsWith('http') || user.avatar_url.startsWith('/') ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.avatar_url
              )
            ) : (
              user.name ? user.name[0] : 'U'
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="font-medium text-gray-900">Level {calculateLevel(user.total_xp || 0).level}</div>
          <div className="text-sm text-gray-500">{user.total_xp || 0} XP</div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {user.longest_streak || 0} days
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatLastActive(user.last_study_date)}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isBanned(user)
          ? 'bg-red-100 text-red-700'
          : 'bg-green-100 text-green-700'
          }`}>
          {(user.status || 'active').toUpperCase()}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            title="View Profile"
          >
            <Eye className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
          </motion.button>

          {isBanned(user) ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
              title="Unban User"
            >
              <Unlock className="w-4 h-4 text-green-600 group-hover:text-green-700" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              title="Ban User"
            >
              <Ban className="w-4 h-4 text-red-600 group-hover:text-red-700" />
            </motion.button>
          )}
        </div>
      </td>
    </motion.tr>
  );
}
