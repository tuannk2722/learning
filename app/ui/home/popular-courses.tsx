'use client';

import { ChevronRight } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { CourseCardAvailable } from "../courses/available-course-card"
import { popularCourses } from "@/app/lib/courses"

export function PopularCourses() {
  return (
    < section id="courses" className="py-20 px-6 bg-gradient-to-b from-white to-violet-50" >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">Popular Courses</h2>
          <p className="text-xl text-gray-600">Start your journey with the most popular courses</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {popularCourses.map((course, index) => (
            <CourseCardAvailable key={course.id} course={course} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/courses" className="px-8 py-4 border-2 border-violet-300 text-violet-700 rounded-xl text-lg hover:border-violet-400 hover:bg-violet-50 transition-all inline-flex items-center gap-2">
            View All Courses
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}