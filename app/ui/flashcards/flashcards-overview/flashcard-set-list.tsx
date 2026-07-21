'use client';

import { useState, useEffect } from "react";
import { Layers } from "lucide-react";
import Link from "next/link";
import type { FlashcardSetDTO } from "@/app/lib/definitions/flashcards";
import { FlashcardSetCard } from "./flashcard-set-card";
import { FlashcardSetListRow } from "./flashcard-set-list-row";
import { deleteFlashcardSet } from "@/app/lib/actions/flashcard";

interface FlashcardSetListProps {
  sets: FlashcardSetDTO[];
  viewMode: "grid" | "list";
  currentUserId: string;
}

export default function FlashcardSetList({ sets, viewMode, currentUserId }: FlashcardSetListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [localSets, setLocalSets] = useState<FlashcardSetDTO[]>(sets);

  useEffect(() => {
    setLocalSets(sets);
  }, [sets]);

  const handleMenuToggle = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bộ flashcard này?")) return;
    setLocalSets((prev) => prev.filter((s) => s.id !== id));
    setOpenMenuId(null);
    await deleteFlashcardSet(id);
  };

  if (localSets.length === 0) {
    return (
      <div className="text-center py-12">
        <Layers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500 font-medium mb-1 text-sm">No flashcard sets found</p>
        <Link href="/dashboard/flashcards/create" className="text-violet-600 text-xs hover:underline">
          Create a new set →
        </Link>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {localSets.map((set, i) => (
          <FlashcardSetCard
            key={set.id}
            set={set}
            index={i}
            isMenuOpen={openMenuId === set.id}
            canEdit={set.ownerId === currentUserId}
            onMenuToggle={handleMenuToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {localSets.map((set, i) => (
        <FlashcardSetListRow
          key={set.id}
          set={set}
          index={i}
          isMenuOpen={openMenuId === set.id}
          canEdit={set.ownerId === currentUserId}
          onMenuToggle={handleMenuToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
