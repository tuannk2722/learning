// 'use client';

// import { TrendingUp } from "lucide-react";
// import { motion } from "motion/react";
// import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
// import type { FlashcardDailyReview } from "@/app/lib/definitions/definitions";

// interface Props {
//   dailyReviews: FlashcardDailyReview[];
// }

// export function AnalyticsFlashcardDailyReviews({ dailyReviews }: Props) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.2 }}
//       className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100"
//     >
//       <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
//         <TrendingUp className="w-5 h-5 text-violet-600" />
//         Flashcard Study
//       </h3>
//       <p className="text-sm text-gray-500 mb-6">Total cards studied this week</p>
//       <ResponsiveContainer width="100%" height={260}>
//         <AreaChart data={dailyReviews} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
//           <defs>
//             <linearGradient id="correctGrad" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
//               <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
//             </linearGradient>
//             <linearGradient id="reviewGrad" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
//               <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
//             </linearGradient>
//           </defs>
//           <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
//           <XAxis dataKey="day" stroke="#9ca3af" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
//           <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
//           <Tooltip contentStyle={{ borderRadius: 12, border: "2px solid #8b5cf6", fontSize: 12 }} />
//           <Legend />
//           <Area type="monotone" dataKey="reviewed" stroke="#7c3aed" strokeWidth={2} fill="url(#reviewGrad)" name="Reviewed" />
//           <Area type="monotone" dataKey="correct" stroke="#10b981" strokeWidth={2} fill="url(#correctGrad)" name="Correct" />
//         </AreaChart>
//       </ResponsiveContainer>
//     </motion.div>
//   );
// }
'use client';

import { TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import type { FlashcardDailyReview } from "@/app/lib/definitions/definitions";

interface Props {
  dailyReviews: FlashcardDailyReview[];
}

export function AnalyticsFlashcardDailyReviews({ dailyReviews }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100"
    >
      <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-violet-600" />
        Flashcard Sets Study
      </h3>
      <p className="text-sm text-gray-500 mb-6">Total cards studied this week</p>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={dailyReviews} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="reviewGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="day" stroke="#9ca3af" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "2px solid #8b5cf6", fontSize: 12 }} />
          <Legend />
          <Area type="monotone" dataKey="total" stroke="#7c3aed" strokeWidth={2} fill="url(#reviewGrad)" name="Total" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}