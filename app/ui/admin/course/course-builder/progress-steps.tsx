"use client";

import { motion } from 'motion/react';
import { steps } from './course-types';

interface ProgressStepsProps {
  step: number;
  setStep: (s: number) => void;
}

export default function ProgressSteps({ step, setStep }: ProgressStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-4">
        {steps.map((s) => (
          <div key={s.num} className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={() => setStep(s.num)}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${step >= s.num ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
            >
              {s.num}
            </motion.div>
            <div className="ml-3 mr-8">
              <div className="text-sm font-medium">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
