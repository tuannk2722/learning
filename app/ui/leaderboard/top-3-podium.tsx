'use client';

import { LeaderboardEntry } from "@/app/lib/definitions/definitions";
import { Crown, Medal } from "lucide-react";
import { motion } from "motion/react";

interface Top3PodiumProps {
  leaderboardData: LeaderboardEntry[];
}

export function Top3Podium({ leaderboardData }: Top3PodiumProps) {

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-3 gap-4 mb-12"
    >
      {/* Second Place */}
      {leaderboardData[1] ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center pt-12"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
            {leaderboardData[1].avatar.startsWith('http') || leaderboardData[1].avatar.startsWith('/') ? (
              <img src={leaderboardData[1].avatar} alt={leaderboardData[1].name} className="w-full h-full object-cover" />
            ) : (
              leaderboardData[1].avatar
            )}
          </div>
          <Medal className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h3 className="font-medium mb-1">{leaderboardData[1].name}</h3>
          <p className="text-sm text-muted-foreground mb-2">Level {leaderboardData[1].level}</p>
          <p className="text-lg font-medium text-indigo-600">{leaderboardData[1].xp.toLocaleString('en-US')} XP</p>
        </motion.div>
      ) : <div />}

      {/* First Place */}
      {leaderboardData[0] ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-300 shadow-lg text-center"
        >
          <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {leaderboardData[0].avatar.startsWith('http') || leaderboardData[0].avatar.startsWith('/') ? (
              <img src={leaderboardData[0].avatar} alt={leaderboardData[0].name} className="w-full h-full object-cover" />
            ) : (
              leaderboardData[0].avatar
            )}
          </div>
          <h3 className="font-medium mb-1 text-lg">{leaderboardData[0].name}</h3>
          <p className="text-sm text-muted-foreground mb-2">Level {leaderboardData[0].level}</p>
          <p className="text-xl font-medium text-indigo-600">{leaderboardData[0].xp.toLocaleString('en-US')} XP</p>
        </motion.div>
      ) : <div />}

      {/* Third Place */}
      {leaderboardData[2] ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center pt-12"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
            {leaderboardData[2].avatar.startsWith('http') || leaderboardData[2].avatar.startsWith('/') ? (
              <img src={leaderboardData[2].avatar} alt={leaderboardData[2].name} className="w-full h-full object-cover" />
            ) : (
              leaderboardData[2].avatar
            )}
          </div>
          <Medal className="w-8 h-8 text-orange-600 mx-auto mb-3" />
          <h3 className="font-medium mb-1">{leaderboardData[2].name}</h3>
          <p className="text-sm text-muted-foreground mb-2">Level {leaderboardData[2].level}</p>
          <p className="text-lg font-medium text-indigo-600">{leaderboardData[2].xp.toLocaleString('en-US')} XP</p>
        </motion.div>
      ) : <div />}
    </motion.div>
  )
}