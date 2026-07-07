"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useTransition } from "react";

interface ActivityLogPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function ActivityLogPagination({
  currentPage,
  totalPages,
}: ActivityLogPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createPageUrl = useCallback(
    (pageNumber: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", pageNumber.toString());
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  const navigateToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    startTransition(() => {
      router.push(createPageUrl(pageNumber));
    });
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between border-t border-gray-200 bg-white px-4 py-4 sm:px-6 rounded-2xl shadow-sm border transition-opacity ${isPending ? "opacity-60" : ""}`}>
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          disabled={currentPage <= 1 || isPending}
          onClick={() => navigateToPage(currentPage - 1)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Trước
        </button>
        <button
          disabled={currentPage >= totalPages || isPending}
          onClick={() => navigateToPage(currentPage + 1)}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Hiển thị trang <span className="font-semibold">{currentPage}</span> /{" "}
            <span className="font-semibold">{totalPages}</span> trang
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm gap-1"
            aria-label="Pagination"
          >
            <button
              disabled={currentPage <= 1 || isPending}
              onClick={() => navigateToPage(currentPage - 1)}
              className="relative inline-flex items-center rounded-lg border border-gray-300 bg-white p-2 text-gray-400 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 h-5" aria-hidden="true" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isCurrent = pageNum === currentPage;

              // Chỉ hiển thị tối đa 5 trang xung quanh trang hiện tại để tránh tràn UI
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - currentPage) <= 1
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => navigateToPage(pageNum)}
                    aria-current={isCurrent ? "page" : undefined}
                    disabled={isPending}
                    className={`relative inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                      isCurrent
                        ? "bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }

              if (
                pageNum === 2 ||
                pageNum === totalPages - 1
              ) {
                return (
                  <span
                    key={pageNum}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-semibold text-gray-700"
                  >
                    ...
                  </span>
                );
              }

              return null;
            })}

            <button
              disabled={currentPage >= totalPages || isPending}
              onClick={() => navigateToPage(currentPage + 1)}
              className="relative inline-flex items-center rounded-lg border border-gray-300 bg-white p-2 text-gray-400 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 h-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
