'use client';

import { useState } from "react";
import { Layers } from "lucide-react";
import Link from "next/link";
import type { FlashcardSet } from "@/app/dashboard/flashcards/(overview)/page";
import { FlashcardSetCard } from "./flashcard-set-card";
import { FlashcardSetListRow } from "./flashcard-set-list-row";

interface FlashcardSetListProps {
  sets: FlashcardSet[];
  viewMode: "grid" | "list";
}

export default function FlashcardSetList({ sets, viewMode }: FlashcardSetListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [localSets, setLocalSets] = useState<FlashcardSet[]>(sets);

  const handleMenuToggle = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleDelete = (id: string) => {
    setLocalSets((prev) => prev.filter((s) => s.id !== id));
    setOpenMenuId(null);
  };

  if (localSets.length === 0) {
    return (
      <div className="text-center py-24">
        <Layers className="w-14 h-14 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500 font-medium mb-2">No flashcard sets found</p>
        <Link href="/dashboard/flashcards/create" className="text-violet-600 text-sm hover:underline">
          Create your first set →
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
          onMenuToggle={handleMenuToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
