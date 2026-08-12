import type { Metadata } from "next";
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import FlashcardBuilderClient from '@/app/ui/flashcards/flashcards-builder/flashcards-builder-client';

export const metadata: Metadata = {
  title: "Create Flashcard Set",
  description: "Build a new flashcard set to supercharge your study sessions on Learning.",
  robots: { index: false, follow: false },
};

export default async function FlashcardCreatePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  return <FlashcardBuilderClient existingSet={undefined} />;
}