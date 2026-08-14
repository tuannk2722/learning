'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { SuggestionItem } from '@/app/api/flashcard-suggest/route';

interface SuggestionDropdownProps {
  isOpen: boolean;
  suggestions: SuggestionItem[];
  onSelect: (text: string) => void;
  onClose: () => void;
}

export function SuggestionDropdown({
  isOpen,
  suggestions,
  onSelect,
  onClose,
}: SuggestionDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && suggestions.length > 0 && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 4, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.99 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="max-h-48 overflow-y-auto py-1 divide-y divide-gray-50">
            {suggestions.map((item, idx) => (
              <button
                key={`${idx}-${item.text.slice(0, 20)}`}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(item.text);
                  onClose();
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-900 transition-colors flex items-center justify-between gap-2 cursor-pointer"
              >
                <span className="line-clamp-2">{item.text}</span>
                {item.partOfSpeech && (
                  <span className="text-[10px] text-gray-400 font-normal italic shrink-0">
                    {item.partOfSpeech}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
