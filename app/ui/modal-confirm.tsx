'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, Info } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  okText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  okText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
}: ConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Close modal on ESC keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Handle confirm click with support for async actions
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Modal confirm action error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Color theme definitions
  const themes = {
    danger: {
      bgIcon: 'bg-red-50 text-red-600 border border-red-100',
      btnOk: 'bg-red-600 hover:bg-red-700 focus:ring-red-500/20 disabled:bg-red-400',
      accentColor: 'red',
      icon: <AlertTriangle className="w-6 h-6" />,
    },
    warning: {
      bgIcon: 'bg-amber-50 text-amber-600 border border-amber-100',
      btnOk: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500/20 disabled:bg-amber-400',
      accentColor: 'amber',
      icon: <AlertTriangle className="w-6 h-6" />,
    },
    info: {
      bgIcon: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      btnOk: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500/20 disabled:bg-indigo-400',
      accentColor: 'indigo',
      icon: <Info className="w-6 h-6" />,
    },
  };

  const activeTheme = themes[type] || themes.danger;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Overlay with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoading && onClose()}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 z-10 overflow-hidden"
          >

            {/* Close button (only available if not loading) */}
            {!isLoading && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-50 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-start gap-4 mt-2">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 leading-6">{title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mt-2">
                  {description}
                </p>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-50 pt-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl border border-slate-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleConfirm}
                className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg shadow-red-500/10 hover:shadow-xl hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-4 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center min-w-[100px] ${activeTheme.btnOk}`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  okText
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
