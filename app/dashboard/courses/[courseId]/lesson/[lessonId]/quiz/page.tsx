import { QuestionType, QuizData } from "@/app/lib/definitions/definitions";
import QuizContainer from "@/app/ui/courses/course-detail/lesson-detail/quiz-detail/quiz-container";


export default async function QuizPage(props: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const params = await props.params;
  const { courseId, lessonId } = params;

  const quizData: QuizData = {
    title: "Variables and Data Types Quiz",
    totalQuestions: 5,
    passingScore: 70,
    xpReward: 500,
    questions: [
      {
        id: 1,
        type: "multiple-choice" as QuestionType,
        question: "Which keyword is used to declare a constant variable in JavaScript?",
        options: ["var", "let", "const", "define"],
        correctAnswer: 2,
        explanation: "`const` is used to declare constant variables that cannot be reassigned."
      },
      {
        id: 2,
        type: "true-false" as QuestionType,
        question: "In JavaScript, `null` and `undefined` are the same thing.",
        correctAnswer: "false",
        explanation: "`null` is an assigned value representing 'no value', while `undefined` means a variable has been declared but not yet assigned a value."
      },
      {
        id: 3,
        type: "multiple-choice" as QuestionType,
        question: "What is the output of `typeof []` in JavaScript?",
        options: ["array", "object", "undefined", "null"],
        correctAnswer: 1,
        explanation: "In JavaScript, arrays are actually objects, so `typeof []` returns 'object'."
      },
      {
        id: 4,
        type: "fill-blank" as QuestionType,
        question: "Fill in the blank: `let myVariable = _____;` to assign a string value.",
        correctAnswer: "\"Hello\"",
        explanation: "Strings in JavaScript can be enclosed in single quotes, double quotes, or backticks."
      },
      {
        id: 5,
        type: "code" as QuestionType,
        question: "What will be the output of the following code?",
        code: `let x = 5;
let y = x;
x = 10;
console.log(y);`,
        options: ["5", "10", "undefined", "error"],
        correctAnswer: 0,
        explanation: "When `y = x` is executed, y gets the VALUE of x (which is 5). Changing x later doesn't affect y."
      }
    ]
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white pt-10 pb-20 px-6 mt-20">
      <QuizContainer
        quiz={quizData}
        courseId={courseId}
        lessonId={lessonId}
      />
    </main>
  );
}