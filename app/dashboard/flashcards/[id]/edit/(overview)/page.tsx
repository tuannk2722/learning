import { sampleSets } from "../../../(overview)/page";
import FlashcardBuilderClient from "@/app/ui/flashcards/flashcards-builder/flashcards-builder-client";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditFlashcardPage({ params }: Props) {
  const { id } = await params;
  const existingSet = sampleSets.find((s) => s.id === id);

  if (!existingSet) {
    notFound();
  }

  return <FlashcardBuilderClient existingSet={existingSet} />;
}