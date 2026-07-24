
export function FlashcardKeyboard() {
  return (
    <div className="mt-2 bg-violet-50/80 rounded-xl px-3 py-1 flex items-center justify-center gap-1.5 text-[11px] text-violet-600 shrink-0">
      <span>⌨️</span>
      <kbd className="px-1.5 py-0.5 bg-white border border-violet-200 rounded-lg font-mono text-[9px] shadow-2xs">Space</kbd>
      <span>to flip •</span>
      <kbd className="px-1.5 py-0.5 bg-white border border-violet-200 rounded-lg font-mono text-[9px] shadow-2xs">←</kbd>
      <kbd className="px-1.5 py-0.5 bg-white border border-violet-200 rounded-lg font-mono text-[9px] shadow-2xs">→</kbd>
      <span>to navigate</span>
    </div>
  )
}