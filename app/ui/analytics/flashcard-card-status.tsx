'use client';

import { Award } from "lucide-react";
import { motion } from "motion/react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { FlashcardCardStatus } from "@/app/lib/definitions/definitions";

interface Props {
  cardStatus: FlashcardCardStatus[];
  totalCards: number;
}

export function AnalyticsFlashcardCardStatus({ cardStatus, totalCards }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28 }}
      className="h-full bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100"
    >
      <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
        <Award className="w-5 h-5 text-violet-600" />
        Card status
      </h3>
      <p className="text-sm text-gray-500 mb-4">Total {totalCards} cards</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={cardStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
            {cardStatus.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v} cards`} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-5 mt-2">
        {cardStatus.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-gray-600">{d.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
