// app/courses/_components/course-list-container.tsx
'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { CourseFilters } from "./courses-filter";
import { CourseGrid } from "./courseGrid";
import { Course } from "@/app/lib/definitions/definitions";

export function CourseListContainer({ initialCourses }: { initialCourses: Course[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const filteredCourses = initialCourses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <>
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-5xl font-bold mb-4">
            Discover <span className="text-violet-600">New Challenges</span>
          </motion.h1>
          <div className="max-w-2xl mx-auto relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, description course..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-violet-100 focus:border-violet-500 outline-none shadow-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <CourseFilters
        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
        selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel}
      />

      <CourseGrid courses={filteredCourses} />
    </>
  );
}