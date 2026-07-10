'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Plus, Check, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type { FlashcardSet } from "@/app/dashboard/flashcards/(overview)/page";
import { BuilderSetInfo } from "./builder-set-info";
import { BuilderToolbar } from "./builder-toolbar";
import { BuilderSearchBar } from "./builder-search-bar";
import { BuilderCardItem, type EditableCard } from "./builder-card-item";

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function makeEmptyCard(): EditableCard {
  return { id: generateId(), front: "", back: "", hint: "" };
}

interface Props {
  existingSet?: FlashcardSet;
}

export default function FlashcardBuilderClient({ existingSet }: Props) {
  const router = useRouter();
  const isEditing = !!existingSet;

  // Set metadata state
  const [title, setTitle] = useState(existingSet?.title ?? "");
  const [description, setDescription] = useState(existingSet?.description ?? "");
  const [isPublic, setIsPublic] = useState(existingSet?.isPublic ?? true);

  // Cards state
  const [cards, setCards] = useState<EditableCard[]>(
    existingSet
      ? existingSet.cards.map((c) => ({ id: c.id, front: c.front, back: c.back, hint: c.hint ?? "" }))
      : [makeEmptyCard(), makeEmptyCard(), makeEmptyCard()]
  );

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [saved, setSaved] = useState(false);

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
    setCards((prev) => [...prev, makeEmptyCard()]);
    setTimeout(() => {
      document.getElementById("cards-bottom")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
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

  const deleteAll = () => {
    if (confirm("Are you sure you want to delete all cards?")) {
      setCards([makeEmptyCard()]);
    }
  };

  // Save handler
  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a title for the flashcard set.");
      return;
    }
    setSaved(true);
    setTimeout(() => {
      router.push("/dashboard/flashcards");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-20">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/flashcards"
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all shadow-sm"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-none">
                  {isEditing ? "Edit Flashcard Set" : "Create New Flashcard Set"}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  {isEditing ? existingSet.title : "Flashcards"}
                </p>
              </div>
            </div>
          </div>

          {/* Save button */}
          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all ${saved
              ? "bg-emerald-500 text-white shadow-emerald-200"
              : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/30 hover:scale-105"
              }`}
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            {saved ? "Saved!" : isEditing ? "Save Changes" : "Finish"}
          </motion.button>
        </div>

        {/* Set Info Section */}
        <BuilderSetInfo
          title={title}
          description={description}
          isPublic={isPublic}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onTogglePublic={() => setIsPublic((p) => !p)}
        />

        {/* Toolbar */}
        <BuilderToolbar
          cardCount={cards.length}
          showSearch={showSearch}
          onAddCard={addCard}
          onToggleSearch={() => { setShowSearch((s) => !s); if (showSearch) setSearchQuery(""); }}
          onSwapFrontBack={swapFrontBack}
          onDeleteAll={deleteAll}
        />

        {/* Search Bar */}
        <BuilderSearchBar
          visible={showSearch}
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {/* Cards List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredCards.map((card) => {
              const index = filteredCards.findIndex((c) => c.id === card.id);
              return (
                <BuilderCardItem
                  key={card.id}
                  card={card}
                  index={index}
                  canDelete={cards.length > 1}
                  onUpdate={updateCard}
                  onDelete={deleteCard}
                />
              )
            }
            )}
          </AnimatePresence>
          <div id="cards-bottom" />
        </div>

        {/* Add card button */}
        <motion.button
          onClick={addCard}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full mt-4 py-5 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all bg-white"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium text-sm">Add new card</span>
        </motion.button>
      </div>

      {/* Floating Save FAB */}
      <AnimatePresence>
        {!saved && (
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
