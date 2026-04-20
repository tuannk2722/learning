import { motion } from "motion/react";
import { Calculator, Atom, Beaker, Globe, BookOpen } from "lucide-react";

const courses = [
  {
    id: 1,
    name: 'Advanced Calculus',
    icon: Calculator,
    progress: 68,
    totalLessons: 24,
    completedLessons: 16,
    timeSpent: 12.5,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 2,
    name: 'Quantum Physics',
    icon: Atom,
    progress: 45,
    totalLessons: 18,
    completedLessons: 8,
    timeSpent: 8.2,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    id: 3,
    name: 'Organic Chemistry',
    icon: Beaker,
    progress: 82,
    totalLessons: 20,
    completedLessons: 16,
    timeSpent: 15.3,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 4,
    name: 'World History',
    icon: Globe,
    progress: 30,
    totalLessons: 30,
    completedLessons: 9,
    timeSpent: 6.5,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
];

export function Learning() {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="mb-8 mt-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5" />
        <h3 className="text-xl">Continue Learning</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course, index) => {
          const Icon = course.icon;
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${course.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${course.iconColor}`} />
                </div>
                <div className="text-sm text-muted-foreground">{course.timeSpent}h</div>
              </div>

              <h4 className="font-medium mb-1">{course.name}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {course.completedLessons}/{course.totalLessons} lessons
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${course.color} rounded-full`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  )
}