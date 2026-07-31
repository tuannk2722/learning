'use client';

import { motion } from "motion/react";

export function TopFlashcardSet() {
  const topDecks = [
    { name: 'Calculus Formulas', subject: 'Mathematics', activeUsers: 1842, avgMastery: 71, sessions: 4320, gradient: '#6366f1' },
    { name: 'Physics Constants', subject: 'Physics', activeUsers: 1234, avgMastery: 58, sessions: 2980, gradient: '#0ea5e9' },
    { name: 'Chemistry Elements', subject: 'Chemistry', activeUsers: 986, avgMastery: 43, sessions: 1870, gradient: '#10b981' },
    { name: 'World History Dates', subject: 'History', activeUsers: 754, avgMastery: 67, sessions: 1540, gradient: '#f59e0b' },
    { name: 'React JS', subject: 'React', activeUsers: 980, avgMastery: 62, sessions: 1870, gradient: '#8b5cf6' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="lg:col-span-2 bg-white rounded-3xl border-2 border-gray-200 shadow-lg overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Top Active Decks</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Ranked by active users this week</p>
      </div>
      <div className="divide-y divide-gray-50">
        {topDecks.map((deck, i) => (
          <motion.div key={deck.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 + i * 0.06 }}
            className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: deck.gradient }}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{deck.name}</div>
              <div className="text-xs text-muted-foreground">{deck.subject}</div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="text-sm font-semibold">{deck.activeUsers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">users</div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="text-sm font-semibold text-emerald-600">{deck.avgMastery}%</div>
              <div className="text-xs text-muted-foreground">mastery</div>
            </div>
            <div className="w-20 flex-shrink-0">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${deck.avgMastery}%` }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}