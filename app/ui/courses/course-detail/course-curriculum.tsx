'use client';

import { Curriculum } from "@/app/lib/definitions/definitions";
import { CheckCircle2, ChevronRight, Clock, Lock, Play, Target, Zap } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function CurriculumSection({
  curriculum, courseId
}: {
  curriculum: Curriculum;
  courseId: string
}) {

  return (
    <section className="pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100"
            >
              <h2 className="text-3xl font-bold mb-6">Curriculum</h2>

              <div className="space-y-6">
                {curriculum.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border-2 border-gray-200 rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-4 border-b-2 border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900">{section.section}</h3>
                      <p className="text-sm text-gray-600">
                        {section.lessons.length} lessons • {section.lessons.reduce((sum, l) => sum + l.duration, 0)} minutes
                      </p>
                    </div>

                    <div className="divide-y divide-gray-200">
                      {section.lessons.map((lesson, lessonIndex) => {
                        // 1. Tạo đường dẫn động
                        const lessonHref = `/dashboard/courses/${courseId}/lesson/${lesson.id}`;

                        return (
                          <Link
                            key={lesson.id}
                            href={lesson.locked ? "#" : lessonHref} // Nếu bị khóa thì không cho chuyển trang
                            className={lesson.locked ? "pointer-events-none" : "block"} // Chặn click nếu bị khóa
                          >
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: 0.4 + lessonIndex * 0.05 }}
                              className={`px-6 py-4 flex items-center justify-between hover:bg-violet-50 transition-colors ${lesson.locked ? "opacity-60" : "cursor-pointer"
                                } ${lesson.isCurrent ? "bg-violet-50" : ""}`}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  {lesson.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                  ) : lesson.locked ? (
                                    <Lock className="w-5 h-5 text-gray-400" />
                                  ) : lesson.isCurrent ? (
                                    <Play className="w-5 h-5 text-violet-600" />
                                  ) : (
                                    <span className="text-sm font-bold text-gray-600">{lesson.id}</span>
                                  )}
                                </div>
                                <div>
                                  <h4 className={`font-bold ${lesson.isCurrent ? "text-violet-700" : "text-gray-900"}`}>
                                    {lesson.title}
                                  </h4>
                                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {lesson.duration} minutes
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Zap className="w-3 h-3 text-yellow-500" />
                                      {lesson.xp} XP
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {!lesson.locked && (
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                              )}
                            </motion.div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* What You'll Learn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-lg border-2 border-violet-100 h-fit"
          >
            <h3 className="text-2xl font-bold mb-6">What You'll Learn</h3>
            <ul className="space-y-3">
              {[
                "Master syntax and core concepts",
                "Build real-world projects",
                "Best practices and design patterns",
                "Debug and optimize code effectively",
                "Prepare for coding interviews",
                "Work with modern tools and frameworks"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
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
        </div>
      </div>
    </section>
  )
}