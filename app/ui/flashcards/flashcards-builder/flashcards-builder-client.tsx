'use client';

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

import type { FlashcardSetForStudy } from "@/app/lib/definitions/flashcards";
import { createFlashcardSet, updateFlashcardSet } from "@/app/lib/actions/flashcard";
import { showAchievementToasts } from "@/app/ui/achievement/achievement-toast";
import { BuilderSetInfo } from "./builder-set-info";
import { BuilderToolbar } from "./builder-toolbar";
import { BuilderSearchBar } from "./builder-search-bar";
import { BuilderCardItem, type BuilderCardItemHandle, type EditableCard } from "./builder-card-item";
import FlashcardBuilderHeader from "./builder-header";
import { LanguageSelector } from "./language-selector";
import { toast } from "sonner";

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function makeEmptyCard(): EditableCard {
  return { id: generateId(), front: "", back: "", imageUrl: "" };
}

interface Props {
  existingSet?: FlashcardSetForStudy;
}

export default function FlashcardBuilderClient({ existingSet }: Props) {
  const router = useRouter();
  const isEditing = !!existingSet;
  const cardRefsMap = useRef<Map<string, BuilderCardItemHandle>>(new Map());

  // Set metadata state
  const [title, setTitle] = useState(existingSet?.title ?? "");
  const [description, setDescription] = useState(existingSet?.description ?? "");
  const [isPublic, setIsPublic] = useState(existingSet?.isPublic ?? true);
  const [tagsString, setTagsString] = useState(existingSet?.tags ? existingSet.tags.join(", ") : "");

  // Cards state
  const [cards, setCards] = useState<EditableCard[]>(
    existingSet && existingSet.cards.length > 0
      ? existingSet.cards.map((c) => ({
        id: c.id,
        front: c.front,
        back: c.back,
        imageUrl: c.imageUrl ?? "",
      }))
      : [makeEmptyCard(), makeEmptyCard(), makeEmptyCard()]
  );

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Language state (set-level)
  const [frontLang, setFrontLang] = useState<string>(existingSet?.frontLang ?? 'en-US');
  const [backLang, setBackLang] = useState<string>(existingSet?.backLang ?? 'en-US');

  // Filtered cards for search
  const filteredCards = showSearch && searchQuery
    ? cards.filter(
      (c) =>
        c.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.back.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : cards;

  // Card operations
  const addCard = () => {
    const newCard = makeEmptyCard();
    setCards((prev) => [...prev, newCard]);
    setTimeout(() => {
      const handle = cardRefsMap.current.get(newCard.id);
      if (handle) {
        handle.focusTerm();
      }
      document.getElementById("cards-bottom")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const updateCard = (id: string, field: keyof EditableCard, value: string) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const deleteCard = (id: string) => {
    if (cards.length <= 1) return;
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const swapFrontBack = () => {
    setCards((prev) => prev.map((c) => ({ ...c, front: c.back, back: c.front })));
  };

  // Save handler
  const handleSave = async () => {
    if (!title.trim() || !tagsString.trim()) {
      toast.error("Please enter the full Title and Tags to save the flashcard set.");
      return;
    }

    const validCards = cards.filter((c) => c.front.trim() && c.back.trim());
    if (validCards.length < 3) {
      toast.error("Please enter at least 3 cards with content.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const tags = tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      description,
      isPublic,
      tags,
      frontLang,
      backLang,
      cards: cards.map((c, idx) => ({
        id: c.id.length > 20 ? c.id : undefined, // UUID check
        front: c.front,
        back: c.back,
        imageUrl: c.imageUrl,
        orderIndex: idx,
      })),
    };

    try {
      const res = isEditing && existingSet
        ? await updateFlashcardSet(existingSet.id, payload)
        : await createFlashcardSet(payload);

      if (res.success) {
        if (res.unlockedAchievements && res.unlockedAchievements.length > 0) {
          showAchievementToasts(res.unlockedAchievements);
        }
        router.push(res.setId ? `/dashboard/flashcards/${res.setId}` : "/dashboard/flashcards");
      } else {
        setIsSaving(false);
        setErrorMessage(res.message);
      }
    } catch (err) {
      console.error(err);
      setIsSaving(false);
      setErrorMessage("System error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Full-screen Loading Overlay when Saving */}
      <AnimatePresence>
        {isSaving && (
          <div className="fixed inset-0 z-[99999] bg-white/10 backdrop-blur-sm cursor-wait" />
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-20">
        {/* Error message if any */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {/* Page Header */}
        <FlashcardBuilderHeader
          title={title}
          isEditing={isEditing}
          handleSave={handleSave}
          saved={isSaving}
        />

        {/* Set Info Section */}
        <BuilderSetInfo
          title={title}
          description={description}
          isPublic={isPublic}
          tagsString={tagsString}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onTagsChange={setTagsString}
          onTogglePublic={() => setIsPublic((p) => !p)}
        />

        {/* Toolbar */}
        <BuilderToolbar
          cardCount={cards.length}
          showSearch={showSearch}
          onAddCard={addCard}
          onToggleSearch={() => { setShowSearch((s) => !s); if (showSearch) setSearchQuery(""); }}
          onSwapFrontBack={swapFrontBack}
          onDeleteAll={() => setCards([makeEmptyCard()])}
        />

        {/* Search Bar */}
        <BuilderSearchBar
          visible={showSearch}
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {/* Language Selection Header (Outside Cards) */}
        <div className="mb-4 p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <Globe className="w-4 h-4 text-violet-500" />
            <span>Card Audio Languages</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Term:</span>
              <LanguageSelector side="TERM" value={frontLang} onChange={setFrontLang} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Definition:</span>
              <LanguageSelector side="DEFINITION" value={backLang} onChange={setBackLang} />
            </div>
          </div>
        </div>

        {/* Cards List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredCards.map((card) => {
              const index = filteredCards.findIndex((c) => c.id === card.id);
              return (
                <BuilderCardItem
                  key={card.id}
                  ref={(el) => {
                    if (el) cardRefsMap.current.set(card.id, el);
                    else cardRefsMap.current.delete(card.id);
                  }}
                  card={card}
                  index={index}
                  canDelete={cards.length > 1}
                  onUpdate={updateCard}
                  onDelete={deleteCard}
                />
              );
            })}
          </AnimatePresence>
          <div id="cards-bottom" />
        </div>

        {/* Add card button */}
        <motion.button
          onClick={addCard}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full mt-4 py-5 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-2 text-gray-600 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all bg-white"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium text-sm">Add new card</span>
        </motion.button>
      </div>

      {/* Floating Save FAB */}
      <AnimatePresence>
        {!isSaving && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={handleSave}
            className="fixed bottom-6 right-6 flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-semibold shadow-xl shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-105 transition-all z-50 text-md"
          >
            {isEditing ? "Save Changes" : "Finish"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
