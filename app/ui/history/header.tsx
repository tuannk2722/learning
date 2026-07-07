'use client';
import { motion } from 'motion/react';

export function HistoryHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-20 mb-8"
    >
      <h1 className="text-3xl font-semibold">
        Learning History
      </h1>
      <p className="text-sm text-muted-foreground">
        Review your learning journey
      </p>
    </motion.div>
  );
}