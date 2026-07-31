'use client';

import { Target } from "lucide-react";
import { motion } from "motion/react";
import { ResponsiveContainer, BarChart, Bar, Cell, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import type { FlashcardSetMastery } from "@/app/lib/definitions/definitions";

interface Props {
  setMastery: FlashcardSetMastery[];
}

export function AnalyticsFlashcardSetMastery({ setMastery }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100"
    >
      <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
        <Target className="w-5 h-5 text-violet-600" />
        Mastery per set
      </h3>
      <p className="text-sm text-gray-500 mb-6">% of cards known in each set</p>
      {setMastery.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-gray-400">
          No flashcard sets found.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(200, setMastery.length * 40)}>
          <BarChart data={setMastery} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#9ca3af" axisLine={false} tickLine={false} unit="%" />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="#9ca3af" axisLine={false} tickLine={false} width={150} />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            <Bar dataKey="pct" radius={[0, 6, 6, 0]} name="Known">
              {setMastery.map((entry, i) => (
                <Cell key={i} fill={entry.pct >= 70 ? "#10b981" : entry.pct >= 40 ? "#7c3aed" : "#a78bfa"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
