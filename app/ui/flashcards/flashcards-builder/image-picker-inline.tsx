'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Upload, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import type { ImageSearchResult } from '@/app/api/image-search/route';

interface ImagePickerInlineProps {
  isOpen: boolean;
  initialQuery: string;
  termLang: string;
  onSelect: (url: string) => void;
  onUploadClick: () => void;
  onClose: () => void;
}

export function ImagePickerInline({
  isOpen,
  initialQuery,
  termLang,
  onSelect,
  onUploadClick,
  onClose,
}: ImagePickerInlineProps) {
  const [query, setQuery] = useState(initialQuery);
  const [images, setImages] = useState<ImageSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }, []);

  const fetchImages = useCallback(async (searchQuery: string) => {
    if (abortRef.current) abortRef.current.abort();

    if (!searchQuery.trim()) {
      setImages([]);
      setHasSearched(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({
        query: searchQuery.trim(),
        termLang,
      });

      const res = await fetch(`/api/image-search?${params}`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error('Failed to fetch images');

      const data = await res.json();
      const imgs = data.images ?? [];
      setImages(imgs);

      // Reset scroll position
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('[ImagePickerInline]', err);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, [termLang]);

  // Check scroll buttons when images update
  useEffect(() => {
    const timer = setTimeout(checkScroll, 100);
    return () => clearTimeout(timer);
  }, [images, checkScroll]);

  // Auto-fetch on open with initial query
  useEffect(() => {
    if (isOpen && initialQuery.trim().length >= 1) {
      setQuery(initialQuery);
      fetchImages(initialQuery);
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchImages(query);
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -280, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 280, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="mt-4 border-t border-gray-100 pt-4">
            {/* Top Bar: Search Input + 'or' + Upload Button */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search images"
                  className="w-full pl-4 pr-10 py-2.5 text-sm bg-slate-100/90 text-gray-700 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:bg-white border border-transparent focus:border-violet-300 transition-all"
                />
                <button
                  type="button"
                  onClick={() => fetchImages(query)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors cursor-pointer"
                  title="Search (or press Enter)"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs font-medium text-slate-400 select-none">or</span>

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => {
                  onUploadClick();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all shrink-0 cursor-pointer"
                title="Upload from device"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Upload</span>
              </button>
            </div>

            {/* Carousel / Image Row */}
            <div className="relative mt-4 flex items-center gap-2">
              {/* Left Arrow */}
              <button
                type="button"
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${canScrollLeft
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 shadow-sm cursor-pointer'
                  : 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-40'
                  }`}
                title="Previous images"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Horizontal Scrollable Container */}
              <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex-1 flex items-center gap-3 overflow-x-auto scroll-smooth py-1 px-0.5 no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-28 h-28 shrink-0 bg-slate-100 rounded-xl animate-pulse"
                    />
                  ))
                ) : images.length > 0 ? (
                  images.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => {
                        onSelect(img.fullUrl);
                        onClose();
                      }}
                      className="group relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-200/80 hover:border-violet-400 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center p-1"
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="max-w-full max-h-full object-contain rounded-lg"
                        loading="lazy"
                      />
                      {/* Photographer overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-1.5">
                        <p className="text-[9px] text-white/90 truncate text-center">
                          📷 {img.photographer}
                        </p>
                      </div>
                    </button>
                  ))
                ) : hasSearched ? (
                  <div className="w-full flex flex-col items-center justify-center py-6 text-center">
                    <ImageIcon className="w-5 h-5 text-gray-300 mb-1" />
                    <p className="text-xs text-gray-400">No images found</p>
                  </div>
                ) : null}
              </div>

              {/* Right Arrow */}
              <button
                type="button"
                onClick={scrollRight}
                disabled={!canScrollRight && images.length <= 4}
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${canScrollRight || images.length > 4
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer'
                  : 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-40'
                  }`}
                title="Next images"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Footer: Close + Pexels attribution */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
              <span className="text-[10px] text-gray-300">Photos by Pexels</span>

              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
