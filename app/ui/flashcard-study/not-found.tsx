'use client';

import Link from "next/link";

export function FlashcardNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 mb-4">Flashcard set not found.</p>
        <Link href="/dashboard/flashcards" className="text-violet-600 hover:underline">
          ← Go Back
        </Link>
      </div>
    </div>
  )
}