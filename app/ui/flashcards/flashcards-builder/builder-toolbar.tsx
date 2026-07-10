'use client';

import { Plus, Trash2, Search, ArrowLeftRight, Lightbulb } from "lucide-react";

interface BuilderToolbarProps {
  cardCount: number;
  showSearch: boolean;
  onAddCard: () => void;
  onToggleSearch: () => void;
  onSwapFrontBack: () => void;
  onDeleteAll: () => void;
}

export function BuilderToolbar({
  cardCount,
  showSearch,
  onAddCard,
  onToggleSearch,
  onSwapFrontBack,
  onDeleteAll,
}: BuilderToolbarProps) {

  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      {/* Left: add button + count */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onAddCard}
          className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm text-gray-600 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-600 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Card
        </button>
        <span className="text-sm text-gray-400">
          <strong className="text-gray-700">{cardCount}</strong> cards
        </span>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-1.5">

        {/* Search toggle */}
        <button
          onClick={onToggleSearch}
          className={`p-2 rounded-xl border transition-all ${showSearch
            ? "bg-violet-100 text-violet-700 border-violet-200 shadow-sm"
            : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
            }`}
          title="Search cards"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Swap columns */}
        <button
          onClick={onSwapFrontBack}
          className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-300 transition-all"
          title="Swap term & definition"
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>

        {/* Delete all */}
        <button
          onClick={onDeleteAll}
          className="p-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
          title="Delete all cards"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
