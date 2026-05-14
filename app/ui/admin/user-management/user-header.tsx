'use client';
import { motion } from 'motion/react';

export default function UserHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-4xl mb-2 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent font-bold">
        User Management
      </h1>
      <p className="text-muted-foreground">View and manage platform users</p>
    </motion.div>
  );
}
