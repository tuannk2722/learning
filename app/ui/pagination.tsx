'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageClick = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return;

      if (onPageChange) {
        onPageChange(page);
      } else {
        startTransition(() => {
          const params = new URLSearchParams(searchParams.toString());
          if (page > 1) {
            params.set('page', page.toString());
          } else {
            params.delete('page');
          }
          router.push(`${pathname}?${params.toString()}`);
        });
      }
    },
    [currentPage, totalPages, onPageChange, searchParams, pathname, router]
  );

  const getPages = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-center mt-6 gap-4 transition-opacity ${
        isPending ? 'opacity-60 pointer-events-none' : ''
      } ${className}`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all text-gray-600 cursor-pointer"
          title="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {getPages().map((page, idx) => {
          if (page === 'ellipsis') {
            return (
              <span key={`dots-${idx}`} className="w-8 text-center text-gray-400">
                ...
              </span>
            );
          }
          const isCurrent = currentPage === page;
          return (
            <button
              key={page}
              type="button"
              onClick={() => handlePageClick(page)}
              disabled={isPending}
              className={`w-10 h-10 rounded-lg font-bold transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all text-gray-600 cursor-pointer"
          title="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
