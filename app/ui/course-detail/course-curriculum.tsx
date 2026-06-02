'use client';

import { CourseCurriculum } from "@/app/lib/definitions/lessons";
import { CheckCircle2, ChevronRight, Clock, Lock, Play, Zap } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function CurriculumSection({
  curriculum, courseId, activeLessonId
}: {
  curriculum: CourseCurriculum;
  courseId: string;
  activeLessonId?: string;
}) {

  return (
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
                const lessonHref = `/dashboard/courses/${courseId}/lesson/${lesson.id}`;
                const isActive = activeLessonId ? lesson.id.toString() === activeLessonId : lesson.isCurrent;

                return (
                  <Link
                    key={lesson.id}
                    href={lesson.locked ? "#" : lessonHref}
                    className={lesson.locked ? "pointer-events-none" : "block"}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + lessonIndex * 0.05 }}
                      className={`px-6 py-4 flex items-center justify-between hover:bg-violet-50 transition-colors ${lesson.locked ? "opacity-60" : "cursor-pointer"
                        } ${isActive ? "bg-violet-100 border-l-4 border-violet-600 pl-5" : "border-l-4 border-transparent pl-5"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {lesson.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : lesson.locked ? (
                            <Lock className="w-5 h-5 text-gray-400" />
                          ) : isActive ? (
                            <Play className="w-5 h-5 text-violet-600" />
                          ) : (
                            <span className="text-sm font-bold text-gray-600">{lesson.id}</span>
                          )}
                        </div>
                        <div>
                          <h4 className={`font-bold ${isActive ? "text-violet-700" : "text-gray-900"}`}>
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
  )
}