import { ArrowLeft, Pencil, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function FlashcardStudyHeader({
  id,
  title,
  isOwner,
  handleRestart,
  currentIndex,
  cardStates
}: {
  id: string;
  title: string;
  isOwner: boolean;
  handleRestart: () => void;
  currentIndex: number;
  cardStates: any[];
}) {
  return (
    <>
      {/* Progress bar */}
      < div className="w-full h-1 bg-gray-100 shrink-0" >
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
          animate={{ width: `${((currentIndex + 1) / cardStates.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div >

      {/* Top Header Actions Bar */}
      < div className="xl:px-10 px-4 py-2 flex items-center justify-between z-20 shrink-0" >
        <Link
          href="/dashboard/flashcards"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to flashcards</span>
        </Link>

        <div className="font-semibold text-xs sm:text-sm text-gray-800 truncate px-2 max-w-[160px] sm:max-w-xs md:max-w-md hidden sm:block">
          {title}
        </div>

        <div className="flex items-center gap-2">
          {isOwner && (
            <Link
              href={`/dashboard/flashcards/${id}/edit`}
              scroll={true}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-100 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div >
    </>
  )
}