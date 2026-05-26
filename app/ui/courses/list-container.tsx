'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { LevelFilter } from "./level-filter";
import { CourseGrid } from "./courseGrid";
import { CourseListing } from "@/app/lib/definitions/courses";

export function CourseListContainer({ initialCourses }: { initialCourses: CourseListing[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const filteredCourses = initialCourses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  return (
    <>
      <section className="pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold mb-4 pt-16">
            Discover <span className="text-violet-600">New Challenges</span>
          </motion.h1>
          <div className="max-w-2xl mx-auto relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              autoComplete="off"
              placeholder="Search by name, description course..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-violet-100 focus:border-violet-500 outline-none shadow-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <LevelFilter
        selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel}
      />

      <CourseGrid courses={filteredCourses} />
    </>
  );
}