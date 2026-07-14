import FlashcardStudyClient from "@/app/ui/flashcard-study/flashcard-study-client";
import { sampleSets } from "../../(overview)/page";

export default async function FlashcardStudyPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const setId = params.id.toString();
  const set = sampleSets.find((s) => s.id === setId);

  if (!set) {
    return <div>Not Found Set</div>
  }

  return <FlashcardStudyClient set={set} />
}
