'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PopconfirmProps {
  title: string;
  description?: string;
  onConfirm: () => void | Promise<void>;
  okText?: string;
  cancelText?: string;
  children: React.ReactNode;
}

export function Popconfirm({
  title,
  description,
  onConfirm,
  okText = 'Yes',
  cancelText = 'No',
  children,
}: PopconfirmProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Xử lý khi click ra ngoài vùng Popconfirm thì tự động đóng
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Xử lý khi bấm nút Confirm
  const handleConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Chặn nổi bọt để không kích hoạt click của thẻ cha
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  // Xử lý khi bấm nút Cancel
  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Thẻ bọc nút bấm kích hoạt. Thêm cursor-pointer để tăng trải nghiệm UI */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-block cursor-pointer"
      >
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            // Chặn đứng sự kiện click bên trong box nội dung để tránh vô tình đóng popconfirm
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-full right-0 mr-2 z-50 w-60 bg-white rounded-xl p-4 shadow-xl border border-gray-150 text-left"
          >
            {/* Mũi tên nhỏ chỉ xuống nút bấm */}
            <div className="absolute top-full right-4 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-white" />

            <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}

            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleCancel}
                className="px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleConfirm}
                className="px-2.5 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors cursor-pointer disabled:bg-red-400 flex items-center justify-center min-w-[50px]"
              >
                {isLoading ? (
                  // Icon loading đơn giản khi đang đợi onConfirm chạy (ví dụ gọi API)
                  <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  okText
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}