'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import type { SuggestionItem } from '@/app/api/flashcard-suggest/route';

interface UseSuggestionsOptions {
  sourceText: string;
  sourceLang: string;
  targetLang: string;
}

export function useFieldSuggestions({
  sourceText,
  sourceLang,
  targetLang,
}: UseSuggestionsOptions) {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const [debouncedText] = useDebounce(sourceText.trim(), 300);

  const fetchSuggestions = useCallback(
    async (word: string, srcL: string, tgtL: string, shouldOpen = false) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }

      if (!word || word.length < 2) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;
      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          term: word,
          termLang: srcL,
          defLang: tgtL,
        });

        const res = await fetch(`/api/flashcard-suggest?${params}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error('Failed to fetch suggestions');

        const data = await res.json();
        const items: SuggestionItem[] = data.suggestions ?? [];

        setSuggestions(items);
        if (shouldOpen && items.length > 0) {
          setIsOpen(true);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error('[useFieldSuggestions]', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Background pre-fetch when source text changes (never opens dropdown here)
  useEffect(() => {
    if (!debouncedText) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    fetchSuggestions(debouncedText, sourceLang, targetLang, false);

    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [debouncedText, sourceLang, targetLang, fetchSuggestions]);

  // Trigger ONLY when user clicks / focuses on the field
  const trigger = useCallback(() => {
    const trimmed = sourceText.trim();
    if (trimmed.length >= 2) {
      if (suggestions.length > 0) {
        setIsOpen(true);
      } else {
        fetchSuggestions(trimmed, sourceLang, targetLang, true);
      }
    }
  }, [sourceText, suggestions, sourceLang, targetLang, fetchSuggestions]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    suggestions,
    isLoading,
    isOpen,
    trigger,
    close,
  };
}
