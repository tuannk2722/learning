'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import ContextMenu from "./context-menu";
import type { FlashcardSetDTO } from "@/app/lib/definitions/flashcards";
import { deleteFlashcardSet } from "@/app/lib/actions/flashcard";

interface Props {
  set: FlashcardSetDTO;
  index: number;
  currentUserId: string;
}

export function FlashcardSetListRow({ set, index, currentUserId }: Props) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const canEdit = set.ownerId === currentUserId;

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleDelete = async () => {
    setIsDeleted(true);
    setIsMenuOpen(false);
    await deleteFlashcardSet(set.id);
  };

  const handleNavigate = () => {
    router.push(`/dashboard/flashcards/${set.id}`);
  };

  if (isDeleted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      role="link"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleNavigate();
        }
      }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 group cursor-pointer"
    >
      {/* Info + Avatar group */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{set.title}</h3>
            {!set.isPublic && (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-[10px] rounded-md flex-shrink-0 font-medium">Private</span>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <span className="flex-shrink-0 text-gray-900">{set.cardCount} cards</span>
            {set.lastAccessed && (
              <span className="truncate text-gray-400">
                Last studied: {new Date(set.lastAccessed).toLocaleDateString('vi-VN')}
              </span>
            )}
          </div>
        </div>

        {/* Avatar */}
        <div className="sm:flex items-center gap-2 flex-shrink-0">
          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-white font-medium text-sm overflow-hidden flex-shrink-0">
            {set.ownerAvatar ? (
              <img src={set.ownerAvatar} alt={set.ownerName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] text-gray-500">{set.ownerName[0]}</span>
            )}
          </div>
          <span className="font-medium text-xs text-gray-500 truncate hidden sm:block max-w-[80px]">{set.ownerName}</span>
        </div>
      </div>

      <div
        className="flex items-center flex-shrink-0"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ContextMenu
          set={set}
          isMenuOpen={isMenuOpen}
          canEdit={canEdit}
          onMenuToggle={handleMenuToggle}
          onDelete={handleDelete}
        />
      </div>
    </motion.div>
  );
}