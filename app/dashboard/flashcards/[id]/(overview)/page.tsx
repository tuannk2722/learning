import type { Metadata } from "next";
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { getFlashcardSetById } from '@/app/lib/data/flashcard';
import { recordSetAccess } from '@/app/lib/actions/flashcard';
import FlashcardStudyClient from '@/app/ui/flashcard-study/flashcard-study-client';

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await props.params;
  const session = await auth();
  const userId = session?.user?.id ?? '';

  const result = await getFlashcardSetById(id, userId);

  if (!result?.set) {
    return {
      title: "Flashcard Set Not Found",
      robots: { index: false, follow: false },
    };
  }

  const { set } = result;
  const tags: string[] = Array.isArray(set.tags) ? (set.tags as string[]) : [];
  const shouldIndex = set.isPublic;

  return {
    title: set.title,
    description:
      set.description ||
      `Study the "${set.title}" flashcard set on Learning.`,
    keywords: tags,
    robots: shouldIndex
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

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

  const { set, cardProgress, studySession, isOwner } = result;

  // Ghi log truy cập (fire-and-forget — không block render)
  void recordSetAccess(id);

  return (
    <FlashcardStudyClient
      set={set}
      initialCardProgress={cardProgress}
      initialStudySession={studySession}
      isOwner={isOwner}
    />
  );
}
