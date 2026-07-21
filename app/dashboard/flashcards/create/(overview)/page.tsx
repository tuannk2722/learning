import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import FlashcardBuilderClient from '@/app/ui/flashcards/flashcards-builder/flashcards-builder-client';

export default async function FlashcardCreatePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  return <FlashcardBuilderClient existingSet={undefined} />;
}