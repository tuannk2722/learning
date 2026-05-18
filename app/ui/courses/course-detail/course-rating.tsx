'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { rateCourse } from '@/app/lib/actions/course';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  courseId: number;
  initialRating?: number | null;
}

export function CourseRating({ courseId, initialRating }: Props) {
  const [rating, setRating] = useState<number>(initialRating || 0);
  const [hover, setHover] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const handleRate = async (value: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setRating(value);

    try {
      const res = await rateCourse(courseId, value);
      if (res.success) {
        toast.success(res.message);
        setTimeout(() => setIsOpen(false), 500); // Close popup after short delay
      } else {
        toast.error(res.message);
        setRating(initialRating || 0);
      }
    } catch (e) {
      toast.error("Failed to rate course");
      setRating(initialRating || 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <Star className={`w-4 h-4 ${rating > 0 ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
        <span className="text-sm font-medium text-gray-700">
          {rating > 0 ? `Your Rating: ${rating}/5` : "Rate Course"}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Rate this Course</h3>
                <p className="text-sm text-gray-500">How would you rate your learning experience?</p>
              </div>

              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="p-2 focus:outline-none transition-transform hover:scale-110 disabled:opacity-50"
                  >
                    <Star
                      className={`w-10 h-10 ${(hover || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                        } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
