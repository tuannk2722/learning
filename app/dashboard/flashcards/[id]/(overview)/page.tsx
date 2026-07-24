import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { getFlashcardSetById } from '@/app/lib/data/flashcard';
import { recordSetAccess } from '@/app/lib/actions/flashcard';
import FlashcardStudyClient from '@/app/ui/flashcard-study/flashcard-study-client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FlashcardStudyPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const { id } = await params;
  const userId = session.user.id;

  const result = await getFlashcardSetById(id, userId);
  if (!result) return notFound();

  const { set, cardProgress, isOwner } = result;

  // Ghi log truy cập (fire-and-forget — không block render)
  void recordSetAccess(id);

  return (
    <FlashcardStudyClient
      set={set}
      initialCardProgress={cardProgress}
      isOwner={isOwner}
    />
  );
}
