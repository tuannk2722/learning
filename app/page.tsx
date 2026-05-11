import { fetchAllCourses } from "./lib/data/courses";
import { getTop1User } from "./lib/data/users";
import { HeroSection } from "./ui/home/hero-section";
import { HIWSection } from "./ui/home/hiw-section";
import { PopularCourses } from "./ui/home/popular-courses";
import { TestimonialsSection } from "./ui/home/testimonials-section";

export default async function Page() {
  const allCourses = await fetchAllCourses();
  const top1User = await getTop1User();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <HeroSection topUser={top1User} />
      <HIWSection />
      <PopularCourses data={allCourses.slice(0, 3)} />
      <TestimonialsSection />
    </div>
  );
}
