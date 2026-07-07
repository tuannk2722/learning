interface QuizPaginationProps {
  totalQuestions: number;
  currentQuestion: number;
  selectedAnswers: { [key: number]: any };
  onNavigate: (index: number) => void;
}

export default function QuizPagination({
  totalQuestions,
  currentQuestion,
  selectedAnswers,
  onNavigate,
}: QuizPaginationProps) {
  const MAX_VISIBLE = 7;

  const getButtonClass = (index: number) => {
    if (index === currentQuestion) return "bg-violet-600 text-white shadow-lg shadow-violet-200";
    if (selectedAnswers[index] !== undefined) return "bg-emerald-100 text-emerald-700";
    return "bg-gray-100 text-gray-500";
  };

  // If few enough questions, show them all
  if (totalQuestions <= MAX_VISIBLE) {
    return (
      <div className="hidden md:flex gap-1.5 items-center">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            className={`w-10 h-10 rounded-lg font-medium transition-all ${getButtonClass(i)}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  }

  // Smart pagination: always show first, last, and a window around current
  const pages: (number | "ellipsis")[] = [];
  const windowSize = 1;

  // Always include first page
  pages.push(0);

  const rangeStart = Math.max(1, currentQuestion - windowSize);
  const rangeEnd = Math.min(totalQuestions - 2, currentQuestion + windowSize);

  if (rangeStart > 1) pages.push("ellipsis");

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < totalQuestions - 2) pages.push("ellipsis");

  // Always include last page
  if (totalQuestions > 1) pages.push(totalQuestions - 1);

  return (
    <div className="hidden md:flex gap-1.5 items-center">
      {pages.map((page, idx) => {
        if (page === "ellipsis") {
          return (
            <span key={`dots-${idx}`} className="w-8 text-center text-gray-400 font-bold select-none">
              ···
            </span>
          );
        }
        return (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`w-10 h-10 rounded-lg font-medium transition-all ${getButtonClass(page)}`}
          >
            {page + 1}
          </button>
        );
      })}
    </div>
  );
}
