'use client';

import { motion } from "motion/react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function TopFlashcardCreation() {
  const setCreationTrend = [
    { week: 'W1', sets: 48 },
    { week: 'W2', sets: 62 },
    { week: 'W3', sets: 55 },
    { week: 'W4', sets: 78 },
    { week: 'W5', sets: 91 },
    { week: 'W6', sets: 84 },
    { week: 'W7', sets: 103 },
    { week: 'W8', sets: 118 },
  ];

  const masteryBySubject = [
    { subject: 'Math', pct: 71, fill: '#6366f1' },
    { subject: 'Physics', pct: 58, fill: '#0ea5e9' },
    { subject: 'Chemistry', pct: 43, fill: '#10b981' },
    { subject: 'History', pct: 67, fill: '#f59e0b' },
    { subject: 'Biology', pct: 55, fill: '#ec4899' },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
      className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg flex flex-col gap-5">
      <div>
        <h2 className="font-semibold">New Sets Created</h2>
        <p className="text-xs text-muted-foreground mt-0.5">8-week trend</p>
      </div>

      <div className="flex-1 min-h-0" style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={setCreationTrend} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
            <Line type="monotone" dataKey="sets" name="Sets" stroke="#6366f1" strokeWidth={2.5}
              dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Mastery by subject bar micro-chart */}
      <div>
        <div className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Mastery by Subject</div>
        <div className="space-y-2">
          {masteryBySubject.map(s => (
            <div key={s.subject} className="flex items-center gap-2">
              <div className="w-14 text-xs text-muted-foreground text-right flex-shrink-0">{s.subject}</div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="h-full rounded-full" style={{ background: s.fill }} />
              </div>
              <div className="text-xs font-semibold w-8 text-right flex-shrink-0"
                style={{ color: s.fill }}>{s.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}