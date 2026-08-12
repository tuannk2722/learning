import type { Metadata } from "next";
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { getFlashcardSetForEdit } from '@/app/lib/data/flashcard';
import FlashcardBuilderClient from '@/app/ui/flashcards/flashcards-builder/flashcards-builder-client';

export const metadata: Metadata = {
  title: "Edit Flashcard Set",
  description: "Edit and update your flashcard set on Learning.",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditFlashcardPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const { id } = await params;
  const userId = session.user.id;

  const existingSet = await getFlashcardSetForEdit(id, userId);
  if (!existingSet) return notFound();

  return <FlashcardBuilderClient existingSet={existingSet} />;
}