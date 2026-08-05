'use client';

import { LogIn, UserPlus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { DynamicIcon } from "../dynamic-icon";
import { getColorClasses } from "@/app/lib/utils/color-palette";
import { CourseDetail } from "@/app/lib/definitions/courses";

interface EnrollModalProps {
  course: CourseDetail;
  isOpen: boolean;
  onClose: () => void;
}

export function EnrollModal({ course, isOpen, onClose }: EnrollModalProps) {
  const { gradient } = getColorClasses(course.theme_color);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto"
            >
              {/* Modal header */}
              <div className={`bg-gradient-to-br ${gradient} px-8 py-8 text-white text-center relative`}>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <DynamicIcon name={course.icon_name} className="w-9 h-9 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-1">Start learning now!</h2>
                <p className="text-white/80 text-sm">{course.name}</p>
              </div>

              {/* Modal body */}
              <div className="px-8 py-6">
                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/signup"
                    className={`w-full py-3.5 bg-gradient-to-r ${gradient} text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-violet-500/25 transition-all hover:scale-[1.02]`}
                  >
                    <UserPlus className="w-5 h-5" />
                    Signup For Free
                  </Link>
                  <Link
                    href="/login"
                    className="w-full py-3.5 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 hover:border-violet-300 hover:text-violet-600 transition-all"
                  >
                    <LogIn className="w-5 h-5" />
                    Already Have an Account? Log In
                  </Link>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">
                  Free to Use · No Credit Card Required · Cancel Anytime
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}