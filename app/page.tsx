import type { Metadata } from "next";
import { auth } from "@/auth";
import { fetchAllCourses } from "./lib/data/courses";
import { getTop1User } from "./lib/data/users";
import { HeroSection } from "./ui/home/hero-section";
import { HIWSection } from "./ui/home/hiw-section";
import { PopularCourses } from "./ui/home/popular-courses";
import { TestimonialsSection } from "./ui/home/testimonials-section";

export const metadata: Metadata = {
  title: "Master Any Skill Online",
  description:
    "Join thousands of learners on Learning. Explore high-quality courses, study smarter with AI-powered flashcards, and track your progress every day.",
  keywords: [
    "online courses",
    "e-learning platform",
    "flashcards",
    "learn online",
    "skill development",
    "education",
  ],
};

export default async function Page() {
  const session = await auth();
  const isGuest = !session?.user;

  const allCourses = await fetchAllCourses();
  const top1User = await getTop1User();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <HeroSection topUser={top1User} />
      <HIWSection />
      <PopularCourses data={allCourses.slice(0, 3)} isGuest={isGuest} />
      <TestimonialsSection />
    </div>
  );
}
