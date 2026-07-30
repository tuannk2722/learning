
/** Status của một card trong một session học — đồng nhất với AnswerStatus trên FE */
export type CardProgressStatus = 'correct' | 'incorrect' | null;

// ─── Core DTOs ─────────────────────────────────────────────────────────────────

/** Một thẻ flashcard (item) — shape trả về từ DB */
export interface FlashcardItemDTO {
  id: string;
  front: string;
  back: string;
  imageUrl: string | null;
  orderIndex: number;
}

/** Metadata của một bộ flashcard — dùng ở overview/list page */
export interface FlashcardSetDTO {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  tags: string[];
  cardCount: number;
  createdAt: Date;
  lastAccessed: Date | null;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string | null;
}

// ─── Study Page Types ──────────────────────────────────────────────────────────

/** Shape truyền xuống FlashcardStudyClient */
export interface FlashcardSetForStudy {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  tags: string[];
  cards: FlashcardItemDTO[];
  frontLang: string;
  backLang: string;
}

/** Map cardId → 'correct' | 'incorrect', truyền xuống từ server cho session gần nhất */
export type CardProgressMap = Record<string, CardProgressStatus>;

/** Metadata phiên học — lưu trạng thái toggle và vị trí card */
export interface StudySessionMeta {
  trackProgress: boolean;
  lastCardIndex: number;
}

// ─── Builder / Form Types ──────────────────────────────────────────────────────

/** Input khi tạo / update set từ builder */
export interface FlashcardSetInput {
  title: string;
  description: string;
  isPublic: boolean;
  tags: string[];
  cards: FlashcardCardInput[];
  frontLang?: string;
  backLang?: string;
}

export interface FlashcardCardInput {
  id?: string;
  front: string;
  back: string;
  imageUrl?: string;
  orderIndex: number;
}

import type { UnlockedAchievement } from './definitions';

export interface FlashcardActionResult {
  success: boolean;
  message: string;
  setId?: string;
  unlockedAchievements?: UnlockedAchievement[];
}

export interface CardProgressUpdate {
  cardId: string;
  status: CardProgressStatus;
}
