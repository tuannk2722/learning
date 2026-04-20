import Link from "next/link";
import { coursesData } from "@/app/lib/courses";
import { CourseInfo } from "@/app/ui/courses/course-detail/course-info";
import { EnrollmentCard } from "@/app/ui/courses/course-detail/enrollment-card";
import { CurriculumSection } from "@/app/ui/courses/course-detail/course-curriculum";

export default async function CourseDetailPage(props: { params: Promise<{ courseId: string }> }) {
  const params = await props.params;
  const courseId = params.courseId.toString();
  const course = coursesData.find(c => c.id.toString() === courseId);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link href="/dashboard/courses" className="text-violet-600 hover:text-violet-700">
            Return to Courses
          </Link>
        </div>
      </div>
    );
  }

  const curriculum = [
    {
      section: "Part 1: Fundamentals",
      lessons: [
        { id: 1, title: "Introduction to the Course", duration: 15, xp: 100, completed: true, locked: false },
        { id: 2, title: "Setting Up Your Environment", duration: 20, xp: 150, completed: true, locked: false },
        { id: 3, title: "Basic Syntax and Variables", duration: 25, xp: 200, completed: true, locked: false },
        { id: 4, title: "Data Types and Operations", duration: 30, xp: 250, completed: false, locked: false, isCurrent: true },
        { id: 5, title: "Control Flow: If/Else", duration: 28, xp: 250, completed: false, locked: false }
      ]
    },
    {
      section: "Part 2: Core Concepts",
      lessons: [
        { id: 6, title: "Functions and Scope", duration: 35, xp: 300, completed: false, locked: false },
        { id: 7, title: "Arrays and Objects", duration: 40, xp: 350, completed: false, locked: false },
        { id: 8, title: "Loops and Iterations", duration: 32, xp: 280, completed: false, locked: false },
        { id: 9, title: "Advanced Object Methods", duration: 38, xp: 320, completed: false, locked: false },
        { id: 10, title: "ES6+ Features", duration: 45, xp: 400, completed: false, locked: true }
      ]
    },
    {
      section: "Part 3: Advanced Topics",
      lessons: [
        { id: 11, title: "Asynchronous JavaScript", duration: 50, xp: 500, completed: false, locked: true },
        { id: 12, title: "Promises and Async/Await", duration: 48, xp: 480, completed: false, locked: true },
        { id: 13, title: "DOM Manipulation", duration: 42, xp: 420, completed: false, locked: true },
        { id: 14, title: "Event Handling", duration: 38, xp: 380, completed: false, locked: true },
        { id: 15, title: "Final Project Challenge", duration: 120, xp: 1500, completed: false, locked: true }
      ]
    }
  ];

  const totalLessons = curriculum.reduce((sum, section) => sum + section.lessons.length, 0);
  const totalDuration = curriculum.reduce((sum, section) =>
    sum + section.lessons.reduce((s, l) => s + l.duration, 0), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      
      {/* Course Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <CourseInfo course={course} totalLessons={totalLessons} totalDuration={totalDuration} />

            {/* Enrollment Card */}
            <EnrollmentCard course={course} />
            
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <CurriculumSection curriculum={curriculum} courseId={courseId} />

    </div>
  );
}
