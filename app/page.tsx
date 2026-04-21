import { HeroSection } from "./ui/home/hero-section";
import { HIWSection } from "./ui/home/hiw-section";
import { PopularCourses } from "./ui/home/popular-courses";
import { TestimonialsSection } from "./ui/home/testimonials-section";


export default function Page() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <HeroSection />
      <HIWSection />
      <PopularCourses />
      <TestimonialsSection />
    </div>
  );
}
