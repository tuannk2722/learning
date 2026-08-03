'use client';

import { motion } from "motion/react";
import { TopActiveDeckDTO } from "@/app/lib/definitions/definitions";

export function TopFlashcardSet({ data }: { data: TopActiveDeckDTO[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="lg:col-span-2 bg-white rounded-3xl border-2 border-gray-200 shadow-lg overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Top Active Flashcard Sets</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Ranked by active users this week</p>
      </div>
      <div className="divide-y divide-gray-50">
        {data.map((deck, i) => (
          <motion.div key={deck.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 + i * 0.06 }}
            className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: deck.gradient }}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{deck.title}</div>
              <div className="text-xs text-muted-foreground">{deck.tags?.join(', ') ?? 'No tags'}</div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="text-sm font-semibold">{deck.activeUsers}</div>
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