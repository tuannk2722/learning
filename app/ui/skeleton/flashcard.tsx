// Skeleton primitives & all flashcard page skeletons

// ── Shared primitive ──────────────────────────────────────────
const Bone = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} style={style} />
);

// ═══════════════════════════════════════════════════════════════
//  PAGE 1 — Overview  (loading.tsx for /dashboard/flashcards)
// ═══════════════════════════════════════════════════════════════

/** Header skeleton: title + "Create Set" button */
export function FlashcardHeaderSkeleton() {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <Bone className="h-9 w-40 rounded-xl" />
          <Bone className="h-4 w-72" />
        </div>
        <Bone className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  );
}

/** Search / filter bar skeleton */
export function FlashcardFilterSkeleton() {
  return (
    <div className="mb-6">
      <Bone className="h-10 w-full max-w-lg rounded-xl" />
    </div>
  );
}

/** Single list-row skeleton (Recent section) */
export function FlashcardListRowSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 p-4">
      <Bone className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <Bone className="h-4 w-48 rounded" />
        <Bone className="h-3 w-28 rounded" />
      </div>
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <Bone className="h-3 w-16 rounded" />
        <Bone className="h-3 w-10 rounded" />
      </div>
    </div>
  );
}

/** Recent list section skeleton */
export function FlashcardRecentSectionSkeleton() {
  return (
    <div className="mb-10">
      <Bone className="h-6 w-24 rounded-lg mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <FlashcardListRowSkeleton key={i} />
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <Bone className="h-9 w-48 rounded-xl" />
      </div>
    </div>
  );
}

/** Single card skeleton (Public/grid section) */
export function FlashcardSetCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 h-full">
      <div className="flex items-start justify-between">
        <Bone className="h-5 w-32 rounded" />
        <Bone className="h-4 w-14 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <Bone className="w-5 h-5 rounded-full" />
        <Bone className="h-3 w-20 rounded" />
      </div>
      <div className="pt-3 mt-auto border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          <Bone className="h-5 w-14 rounded-md" />
          <Bone className="h-5 w-14 rounded-md" />
        </div>
        <Bone className="h-7 w-16 rounded-xl" />
      </div>
    </div>
  );
}

/** Public grid section skeleton */
export function FlashcardPublicSectionSkeleton() {
  return (
    <div>
      <Bone className="h-6 w-48 rounded-lg mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <FlashcardSetCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/** Full Overview page skeleton */
export function FlashcardsOverviewPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-5 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <FlashcardHeaderSkeleton />
          <FlashcardFilterSkeleton />
          <FlashcardRecentSectionSkeleton />
          <FlashcardPublicSectionSkeleton />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PAGE 2 — Study  (loading.tsx for /dashboard/flashcards/[id])
// ═══════════════════════════════════════════════════════════════

export function FlashcardStudyPageSkeleton() {
  return (
    <div className="h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-white flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 bg-white shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <Bone className="w-8 h-8 rounded-lg" />
          <Bone className="h-5 w-40 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Bone className="h-8 w-8 rounded-lg" />
          <Bone className="h-8 w-8 rounded-lg" />
        </div>
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 gap-4">
        <div className="flex items-center justify-between w-full max-w-2xl">
          <Bone className="h-4 w-24 rounded" />
          <Bone className="h-4 w-24 rounded" />
        </div>
        <Bone className="w-full max-w-2xl rounded-3xl" style={{ minHeight: 320 }} />
        <Bone className="h-7 w-56 rounded-xl" />
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-100 bg-white gap-3">
        <Bone className="h-11 w-11 rounded-xl" />
        <div className="flex gap-3 flex-1 max-w-md">
          <Bone className="h-11 flex-1 rounded-xl" />
          <Bone className="h-11 flex-1 rounded-xl" />
        </div>
        <Bone className="h-11 w-11 rounded-xl" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PAGE 3 — Create / Edit builder
// ═══════════════════════════════════════════════════════════════

function BuilderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
        <Bone className="h-4 w-6 rounded" />
        <Bone className="h-6 w-6 rounded-lg" />
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Bone className="h-10 w-full rounded-xl" />
          <Bone className="h-3 w-10 rounded" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <Bone className="h-10 w-full rounded-xl" />
            <Bone className="h-3 w-16 rounded" />
          </div>
          <Bone className="w-16 h-16 rounded-xl flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}

export function FlashcardBuilderPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-20">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bone className="w-8 h-8 rounded-lg" />
            <Bone className="h-7 w-48 rounded-xl" />
          </div>
          <Bone className="h-10 w-28 rounded-xl" />
        </div>

        {/* Set info card */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-5 mb-4 flex flex-col gap-4">
          <Bone className="h-11 w-full rounded-xl" />
          <Bone className="h-16 w-full rounded-xl" />
          <div className="flex gap-4">
            <Bone className="h-10 flex-1 rounded-xl" />
            <Bone className="h-10 flex-1 rounded-xl" />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4">
          <Bone className="h-9 w-28 rounded-xl" />
          <Bone className="h-5 w-14 rounded" />
          <div className="ml-auto flex gap-2">
            <Bone className="h-9 w-9 rounded-xl" />
            <Bone className="h-9 w-9 rounded-xl" />
            <Bone className="h-9 w-9 rounded-xl" />
          </div>
        </div>

        {/* Language selector row */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-xs p-4 mb-4 flex items-center justify-between">
          <Bone className="h-4 w-36 rounded" />
          <div className="flex gap-6">
            <Bone className="h-8 w-28 rounded-lg" />
            <Bone className="h-8 w-32 rounded-lg" />
          </div>
        </div>

        {/* Cards list */}
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <BuilderCardSkeleton key={i} />
          ))}
        </div>

        {/* Add card button placeholder */}
        <Bone className="w-full h-16 rounded-2xl mt-4" />
      </div>
    </div>
  );
}
