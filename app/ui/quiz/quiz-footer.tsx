import { Flag, ChevronRight, ChevronLeft } from "lucide-react";
import QuizPagination from "./quiz-pagination";
import { useState } from "react";
import { ConfirmModal } from "../modal-confirm";

interface QuizFooterProps {
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswers: { [key: number]: any };
  isSubmitting?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onNavigate: (index: number) => void;
  onSubmit: () => void;
}

export default function QuizFooter({
  currentQuestion,
  totalQuestions,
  selectedAnswers,
  isSubmitting = false,
  onPrevious,
  onNext,
  onNavigate,
  onSubmit,
}: QuizFooterProps) {
  const [showModalConfirm, setShowModalConfirm] = useState(false);

  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 z-[9998] bg-white/10 backdrop-blur-sm cursor-wait" />
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" /> Previous
        </button>

        <QuizPagination
          totalQuestions={totalQuestions}
          currentQuestion={currentQuestion}
          selectedAnswers={selectedAnswers}
          onNavigate={onNavigate}
        />

        {isLastQuestion ? (
          <button
            onClick={() => setShowModalConfirm(true)}
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-violet-200 transition-all ${isSubmitting
              ? "bg-gray-400 text-white cursor-wait"
              : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90"
              }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Flag className="w-5 h-5" /> Submit
              </>
            )}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700"
          >
            Next <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <ConfirmModal
        isOpen={showModalConfirm}
        onClose={() => setShowModalConfirm(false)}
        onConfirm={() => onSubmit()}
        title="Confirm Submit"
        description="Are you sure you want to submit?"
        okText="Submit"
        cancelText="Cancel"
        type="info"
      />
    </>
  );
}
