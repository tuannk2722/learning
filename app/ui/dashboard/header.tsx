'use client';

import { motion } from "motion/react";

export function HeaderDashboard({ isNew, name }: { isNew: boolean, name: string | undefined }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <h1 className="text-4xl font-bold mb-2">
        {isNew ? 'Welcome,' : 'Welcome back,'} <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{name}!</span>
      </h1>
      <p className="text-xl text-gray-600">{isNew ? 'Start your journey by choosing a course' : 'Continue your journey of conquering knowledge'}</p>
    </motion.div>
  )
}