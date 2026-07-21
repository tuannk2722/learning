/**
 * flashcards.ts — Type definitions cho tính năng Flashcards.
 * Được dùng ở cả Server (actions/data) và Client Components.
 */

// ─── Card Progress ─────────────────────────────────────────────────────────────

/** Status của một card trong một session học */
export type CardProgressStatus = 'know' | 'still_learning' | null;

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
  themeColor: string;
  tags: string[];
  cardCount: number;
  /** Số cards có status "know" của session gần nhất (khi trackProgress bật) */
  masteredCount: number;
  createdAt: Date;
  /** Thời điểm user truy cập set này gần nhất (null nếu chưa từng truy cập) */
  lastAccessed: Date | null;
  /** id của owner */
  ownerId: string;
  /** Tên của owner */
  ownerName: string;
  /** Avatar URL của owner */
  ownerAvatar: string | null;
}

// ─── Study Page Types ──────────────────────────────────────────────────────────

/** Shape truyền xuống FlashcardStudyClient */
export interface FlashcardSetForStudy {
  id: string;
  title: string;
  description: string | null;
  themeColor: string;
  isPublic: boolean;
  tags: string[];
  cards: FlashcardItemDTO[];
}

/** Map cardId → status, truyền xuống từ server cho session gần nhất */
export type CardProgressMap = Record<string, CardProgressStatus>;

// ─── Builder / Form Types ──────────────────────────────────────────────────────

/** Input khi tạo / update set từ builder */
export interface FlashcardSetInput {
  title: string;
  description: string;
  isPublic: boolean;
  themeColor: string;
  /** Mảng tags sau khi parse từ string ngăn bởi dấu phẩy */
  tags: string[];
  cards: FlashcardCardInput[];
}

export interface FlashcardCardInput {
  /** UUID nếu là card đang edit, bỏ trống nếu là card mới */
  id?: string;
  front: string;
  back: string;
  imageUrl?: string;
  orderIndex: number;
}

// ─── Action Results ────────────────────────────────────────────────────────────

export interface FlashcardActionResult {
  success: boolean;
  message: string;
  setId?: string;
}

export interface CardProgressUpdate {
  cardId: string;
  status: CardProgressStatus;
}
