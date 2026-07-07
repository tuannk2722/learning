'use client';

import { useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { CourseFilter } from "./course-filter";
import { CourseGrid } from "./courseGrid";
import { CourseListing, Category } from "@/app/lib/definitions/courses";
import { removeAccents } from "@/app/lib/utils/removeAccents";

interface CourseListContainerProps {
  initialCourses: CourseListing[];
  categories: Category[];
}

export function CourseListContainer({ initialCourses, categories }: CourseListContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const filteredCourses = initialCourses.filter((course) => {
    const matchesSearch = removeAccents(course.name).includes(removeAccents(searchQuery)) ||
      removeAccents(course.description).includes(removeAccents(searchQuery));

    const matchesCategory = selectedCategory === "All" || course.category_name === selectedCategory;
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
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

      <CourseFilter
        selectedCategory={selectedCategory}
        selectedLevel={selectedLevel}
        setSelectedCategory={setSelectedCategory}
        setSelectedLevel={setSelectedLevel}
        categories={categories}
      />

      <CourseGrid courses={filteredCourses} />
    </>
  );
}