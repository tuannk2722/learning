import { Course } from "@/app/lib/definitions/courses";
import { CourseCardAvailable } from "./available-course-card";


export const CourseGrid = ({ courses }: { courses: Course[] }) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 mx-6">
        <p className="text-xl text-gray-400">Không tìm thấy khóa học nào phù hợp 😢</p>
      </div>
    );
  }

  return (
    <section className="pb-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <CourseCardAvailable key={course.id} course={course} index={index} />
        ))}
      </div>
    </section>
  );
};