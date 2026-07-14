'use client';
import { Flame } from "lucide-react";
import { motion } from "motion/react";


export function AchievementTitle() {

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10"
    >
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-3">

          <div>
            <h1 className="text-3xl font-semibold">
              Achievements
            </h1>
            <p className="text-sm text-muted-foreground">
              Collect badges and prove your abilities
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}