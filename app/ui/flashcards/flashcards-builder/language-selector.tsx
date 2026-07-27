'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Check, ChevronDown } from 'lucide-react';
import { TOP_LANGUAGES, getLanguageName, type Language } from '@/app/lib/constants/languages';

interface LanguageSelectorProps {
  side: 'TERM' | 'DEFINITION';
  value: string;
  onChange: (code: string) => void;
}

export function LanguageSelector({ side, value, onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search input khi mở
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered: Language[] =
    query.trim()
      ? TOP_LANGUAGES.filter((l) =>
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.code.toLowerCase().includes(query.toLowerCase())
      )
      : TOP_LANGUAGES;

  const handleSelect = useCallback(
    (code: string) => {
      onChange(code);
      setIsOpen(false);
      setQuery('');
    },
    [onChange]
  );

  const currentName = getLanguageName(value);

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-1 text-xs font-semibold text-violet-500 hover:text-violet-700 transition-colors group"
        title={`Choose language for ${side}`}
      >
        <span className="uppercase tracking-widest">
          {currentName !== 'en-US' || value !== 'en-US' ? currentName : 'Choose Language'}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 top-full mt-2 z-50 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
          >
            {/* Search */}
            <div className="p-3 border-b border-gray-50">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search languages..."
                  className="flex-1 text-xs bg-transparent outline-none text-gray-700 placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Language list */}
            <div className="max-h-60 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No languages found</p>
              ) : (
                <>
                  {!query && (
                    <p className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Top Languages
                    </p>
                  )}
                  {filtered.map((lang) => {
                    const isSelected = lang.code === value;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelect(lang.code)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${isSelected
                          ? 'bg-violet-50 text-violet-700'
                          : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        <span className="text-sm font-medium">{lang.name}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
