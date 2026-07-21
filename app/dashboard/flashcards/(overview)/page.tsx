import { Suspense } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getFlashcardSets } from '@/app/lib/data/flashcard';
import FlashcardFilter from '@/app/ui/flashcards/flashcards-overview/flashcard-filter';
import FlashcardHeader from '@/app/ui/flashcards/flashcards-overview/flashcard-header';
import FlashcardSetList from '@/app/ui/flashcards/flashcards-overview/flashcard-set-list';
import { Earth, Folder } from 'lucide-react';
import type { FlashcardSetDTO } from '@/app/lib/definitions/flashcards';

// Re-export để các component import type nếu cần
export type { FlashcardSetDTO };

interface PageProps {
  searchParams: Promise<{ q?: string; tag?: string; view?: string }>;
}

export default async function FlashcardsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const { q = '', tag = 'all', view = 'grid' } = await searchParams;
  const userId = session.user.id;

  const { recentSets, publicSets, allTags } = await getFlashcardSets(userId, q, tag);

  const viewMode = view === 'list' ? 'list' : 'grid';

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-5 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FlashcardHeader />

          {/* Filter Bar */}
          <Suspense>
            <FlashcardFilter allTags={allTags} />
          </Suspense>

          {/* Recent Section */}
          <h2 className="text-xl mb-4 flex items-center gap-2 font-semibold">
            <Folder className="w-5 h-5" />
            Recent
          </h2>

          <FlashcardSetList
            sets={recentSets}
            viewMode={viewMode}
            currentUserId={userId}
          />

          {/* Public Section */}
          {publicSets.length > 0 && (
            <>
              <h2 className="text-xl mt-10 mb-4 flex items-center gap-2 font-semibold">
                <Earth className="w-5 h-5" />
                Students also studying
              </h2>
              <FlashcardSetList
                sets={publicSets}
                viewMode={viewMode}
                currentUserId={userId}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
