import { Suspense } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getFlashcardSets } from '@/app/lib/data/flashcard';
import FlashcardFilter from '@/app/ui/flashcards/flashcards-overview/flashcard-filter';
import FlashcardHeader from '@/app/ui/flashcards/flashcards-overview/flashcard-header';
import { FlashcardSetCard } from '@/app/ui/flashcards/flashcards-overview/flashcard-set-card';
import { FlashcardSetListRow } from '@/app/ui/flashcards/flashcards-overview/flashcard-set-list-row';
import { Pagination } from '@/app/ui/pagination';
import { Earth, Folder } from 'lucide-react';
import type { FlashcardSetDTO } from '@/app/lib/definitions/flashcards';
import {
  FlashcardFilterSkeleton,
  FlashcardRecentSectionSkeleton,
  FlashcardPublicSectionSkeleton,
} from '@/app/ui/skeleton/flashcard';

export type { FlashcardSetDTO };

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function FlashcardsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const { q, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const userId = session.user.id;

  const { recentSets, publicSets, totalRecentPages } = await getFlashcardSets(
    userId,
    q || '',
    currentPage,
    5
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-5 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FlashcardHeader />

          {/* Filter Bar — needs useSearchParams → wrap in Suspense */}
          <Suspense fallback={<FlashcardFilterSkeleton />}>
            <FlashcardFilter />
          </Suspense>

          {q && recentSets.length === 0 && publicSets.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 mx-6">
              <p className="text-xl text-gray-400">No flashcards found for "{q}" 😢</p>
            </div>
          )}

          {/* Recent Section */}
          <Suspense fallback={<FlashcardRecentSectionSkeleton />}>
            {recentSets.length > 0 && (
              <>
                <h2 className="text-xl mb-4 flex items-center gap-2 font-semibold">
                  <Folder className="w-5 h-5" />
                  Recent
                </h2>

                <div className="space-y-3">
                  {recentSets.map((set, i) => (
                    <FlashcardSetListRow
                      key={set.id}
                      set={set}
                      index={i}
                      currentUserId={userId}
                    />
                  ))}
                </div>

                {/* Pagination cho Recent Sets */}
                <div className="flex items-center justify-end mr-10">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalRecentPages}
                  />
                </div>
              </>
            )}
          </Suspense>

          {/* Public Section */}
          <Suspense fallback={<FlashcardPublicSectionSkeleton />}>
            {publicSets.length > 0 && (
              <>
                <h2 className="text-xl mt-10 mb-4 flex items-center gap-2 font-semibold">
                  <Earth className="w-5 h-5" />
                  Students also studying
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {publicSets.map((set, i) => (
                    <FlashcardSetCard
                      key={set.id}
                      set={set}
                      index={i}
                    />
                  ))}
                </div>
              </>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
