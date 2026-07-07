'use client';
import { motion } from 'motion/react';

export function CourseTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-semibold">
              Your Courses
            </h1>
            <p className="text-sm text-muted-foreground">
              Continue your learning journey
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}