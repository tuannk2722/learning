'use client';

import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';
import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { hexForThemeColor } from '@/app/lib/utils/color-palette';

interface AchievementData {
  name: string;
  awarded: number;
  iconName: string;
  themeColor: string;
}

export default function TopAchievements({ data }: { data: AchievementData[] }) {
  const achievements = (data ?? [])
    .map((a, i) => ({
      ...a,
      color: hexForThemeColor(a.themeColor, i),
    }))
    .sort((a, b) => b.awarded - a.awarded);

  const achievementTotal = achievements.reduce((s, a) => s + a.awarded, 0);

  if (achievements.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h2 className="font-semibold mb-1">Top Achievements Awarded</h2>
        <p className="text-xs text-muted-foreground">No achievements awarded yet.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-semibold">Top Achievements Awarded</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{achievementTotal.toLocaleString()} total this month</p>
        </div>
        <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-lg">
          <Trophy className="w-3.5 h-3.5 text-yellow-500" />
          <span className="text-xs font-medium text-yellow-700">{achievements.length} badges</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-center">
        {/* Donut chart */}
        <div
          className="flex-none mx-auto sm:mx-0"
          style={{ width: 240, height: 240, minWidth: 240, minHeight: 240 }}
        >
          <ResponsiveContainer width="100%" height="100%" minWidth={240} minHeight={240}>
            <RePieChart>
              <Pie
                data={achievements}
                cx="50%"
                cy="50%"
                innerRadius={66}
                outerRadius={108}
                dataKey="awarded"
                nameKey="name"
                paddingAngle={2}
                strokeWidth={0}
                isAnimationActive={false}
              >
                {achievements.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0];
                  const pct = ((d.value as number) / achievementTotal * 100).toFixed(1);
                  return (
                    <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-3 py-2 text-xs">
                      <div className="font-semibold mb-1" style={{ color: d.payload.color }}>{d.name}</div>
                      <div className="flex gap-2 text-muted-foreground">
                        <span>{(d.value as number).toLocaleString()} awarded</span>
                        <span>·</span>
                        <span className="font-medium text-gray-800">{pct}%</span>
                      </div>
                    </div>
                  );
                }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend list */}
        <div className="w-full sm:max-w-[220px] space-y-1.5">
          {achievements.map((a, i) => {
            const pct = (a.awarded / achievementTotal * 100).toFixed(1);
            return (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.04 }}
                className="flex items-center gap-2 group"
              >
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: a.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium truncate">{a.name}</span>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{pct}%</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, delay: 0.7 + i * 0.04 }}
                      className="h-full rounded-full"
                      style={{ background: a.color }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold w-12 text-right flex-shrink-0" style={{ color: a.color }}>
                  {a.awarded >= 1000 ? `${(a.awarded / 1000).toFixed(1)}k` : a.awarded}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}