'use client';

import { motion } from "motion/react";
import { CheckCircle2, Target } from "lucide-react";
import { ListLesson } from "@/app/lib/definitions/lessons";

export function WillLearned({ listedLessons }: { listedLessons: ListLesson }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100 h-fit"
    >
      <h3 className="text-2xl font-bold mb-6">What You'll Learn</h3>
      <ul className="space-y-3">
        {listedLessons.map((lesson, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{lesson.title}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-violet-600" />
          Prerequisites
        </h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Computer with internet connection</li>
          <li>• Passion for learning and practice</li>
          <li>• No prior knowledge required</li>
        </ul>
      </div>
    </motion.div>
  )
}