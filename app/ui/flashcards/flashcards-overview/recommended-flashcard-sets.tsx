'use client';

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { FlashcardSetCard } from '@/app/ui/flashcards/flashcards-overview/flashcard-set-card';
import type { FlashcardSetDTO } from '@/app/lib/definitions/flashcards';

interface Props {
  sets: FlashcardSetDTO[];
  interestTags: string[];
}

export function RecommendedFlashcardSets({ sets, interestTags }: Props) {
  if (sets.length === 0) return null;

  const isPersonalized = interestTags.length > 0;

  return (
    <section className="mt-10">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {isPersonalized ? 'Recommended for You' : 'Popular Sets'}
          </h2>
        </div>

        {isPersonalized && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {interestTags.slice(0, 4).map((tag) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[11px] font-medium px-2.5 py-0.5 bg-violet-100 text-violet-700 rounded-full border border-violet-200"
              >
                #{tag}
              </motion.span>
            ))}
            {interestTags.length > 4 && (
              <span className="text-[11px] text-gray-400">+{interestTags.length - 4} more</span>
            )}
          </div>
        )}
      </div>

      {/* Flashcard Set Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {sets.map((set, i) => (
          <FlashcardSetCard key={set.id} set={set} index={i} />
        ))}
      </div>
    </section>
  );
}
