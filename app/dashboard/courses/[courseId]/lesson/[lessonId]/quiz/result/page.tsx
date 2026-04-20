import QuizResultsContainer from "@/app/ui/courses/course-detail/lesson-detail/quiz-detail/result-detail/result-container";

type Params = Promise<{ courseId: string; lessonId: string }>;
type SearchParams = Promise<{ score?: string; total?: string }>;

export default async function QuizResultsPage(props: { 
  params: Params; 
  searchParams: SearchParams 
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const score = parseInt(searchParams.score || "0");
  const total = parseInt(searchParams.total || "5");
  
  const detailedResults = [
    {
      id: 1,
      question: "Which keyword is used to declare a constant variable?",
      userAnswer: "const",
      correctAnswer: "const",
      isCorrect: true,
      explanation: "`const` is used to declare constant variables that cannot be reassigned."
    },
    {
      id: 2,
      question: "In JavaScript, `null` and `undefined` are the same thing.",
      userAnswer: "false",
      correctAnswer: "false",
      isCorrect: true,
      explanation: "`null` is an assigned value representing 'no value', while `undefined` means a variable has been declared but not yet assigned."
    },
    {
      id: 3,
      question: "What is the output of `typeof []`?",
      userAnswer: "array",
      correctAnswer: "object",
      isCorrect: false,
      explanation: "In JavaScript, arrays are actually objects, so `typeof []` returns 'object'."
    },
    {
      id: 4,
      question: "Fill in the blank: `let myVariable = _____;` to assign a string.",
      userAnswer: "\"text\"",
      correctAnswer: "\"Hello\"",
      isCorrect: true,
      explanation: "Strings in JavaScript can be enclosed in single quotes, double quotes, or backticks. Your answer was accepted as correct."
    },
    {
      id: 5,
      question: "What will be the output of the code?",
      userAnswer: "5",
      correctAnswer: "5",
      isCorrect: true,
      explanation: "When `y = x` is executed, y gets the VALUE of x (which is 5). Changing x later doesn't affect y."
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white pt-20 pb-20 px-6">
      <QuizResultsContainer 
        courseId={params.courseId}
        lessonId={params.lessonId}
        score={score}
        total={total}
        results={detailedResults}
      />
    </main>
  );
}