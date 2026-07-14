'use client';

import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";

interface BuilderSearchBarProps {
  visible: boolean;
  value: string;
  onChange: (val: string) => void;
}

export function BuilderSearchBar({ visible, value, onChange }: BuilderSearchBarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden mb-4"
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Search in this set..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 shadow-sm transition-all"
              autoFocus
            />
            {value && (
              <button
                onClick={() => onChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
