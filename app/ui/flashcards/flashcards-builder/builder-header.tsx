import { ArrowLeft, Check } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

interface Props {
  isEditing: boolean;
  title: string;
  handleSave: () => void;
  saved: boolean;
}

export default function FlashcardBuilderHeader({ isEditing, title, handleSave, saved }: Props) {

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/flashcards"
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all shadow-sm"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">
              {isEditing ? "Edit Flashcard Set" : "Create New Flashcard Set"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEditing ? title : "Flashcards"}
            </p>
          </div>
        </div>
      </div>

      {/* Save button */}
      <motion.button
        onClick={handleSave}
        whileTap={{ scale: 0.97 }}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all ${saved
          ? "bg-emerald-500 text-white shadow-emerald-200"
          : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/30 hover:scale-105"
          }`}
      >
        {saved ? <Check className="w-4 h-4" /> : null}
        {saved ? "Saved!" : isEditing ? "Save Changes" : "Finish"}
      </motion.button>
    </div>
  )
}