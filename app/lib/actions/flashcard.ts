'use server';

import { db } from '../db';
import {
  flashcard_sets,
  flashcard_items,
  flashcard_access_log,
  flashcard_card_progress,
} from '../db/schema';
import { eq, and, inArray, notInArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type {
  FlashcardSetInput,
  FlashcardActionResult,
  CardProgressUpdate,
} from '../definitions/flashcards';

// ─── Helper ───────────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
}

// ─── CREATE ───────────────────────────────────────────────────────────────────

export async function createFlashcardSet(
  data: FlashcardSetInput
): Promise<FlashcardActionResult> {
  try {
    const userId = await requireAuth();

    if (!data.title.trim()) {
      return { success: false, message: 'Tiêu đề không được để trống.' };
    }
    if (!data.cards.some((c) => c.front.trim() || c.back.trim())) {
      return { success: false, message: 'Cần ít nhất 1 thẻ có nội dung.' };
    }

    const [newSet] = await db
      .insert(flashcard_sets)
      .values({
        owner_id: userId,
        title: data.title.trim(),
        description: data.description.trim() || null,
        is_public: data.isPublic,
        theme_color: data.themeColor,
        tags: data.tags.filter(Boolean),
      })
      .returning({ id: flashcard_sets.id });

    const validCards = data.cards.filter(
      (c) => c.front.trim() || c.back.trim()
    );

    if (validCards.length > 0) {
      await db.insert(flashcard_items).values(
        validCards.map((c, idx) => ({
          set_id: newSet.id,
          front: c.front.trim(),
          back: c.back.trim(),
          image_url: c.imageUrl?.trim() || null,
          order_index: idx,
        }))
      );
    }

    revalidatePath('/dashboard/flashcards');
    return { success: true, message: 'Tạo thành công!', setId: newSet.id };
  } catch (err) {
    console.error('[createFlashcardSet]', err);
    return { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' };
  }
}

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export async function updateFlashcardSet(
  setId: string,
  data: FlashcardSetInput
): Promise<FlashcardActionResult> {
  try {
    const userId = await requireAuth();

    // Kiểm tra ownership
    const [existing] = await db
      .select({ owner_id: flashcard_sets.owner_id })
      .from(flashcard_sets)
      .where(eq(flashcard_sets.id, setId))
      .limit(1);

    if (!existing) return { success: false, message: 'Không tìm thấy set.' };
    if (existing.owner_id !== userId)
      return { success: false, message: 'Bạn không có quyền chỉnh sửa set này.' };

    if (!data.title.trim()) {
      return { success: false, message: 'Tiêu đề không được để trống.' };
    }

    // Update metadata
    await db
      .update(flashcard_sets)
      .set({
        title: data.title.trim(),
        description: data.description.trim() || null,
        is_public: data.isPublic,
        theme_color: data.themeColor,
        tags: data.tags.filter(Boolean),
        updated_at: new Date(),
      })
      .where(eq(flashcard_sets.id, setId));

    const validCards = data.cards.filter(
      (c) => c.front.trim() || c.back.trim()
    );

    // Lấy danh sách card ids hiện tại
    const existingItems = await db
      .select({ id: flashcard_items.id })
      .from(flashcard_items)
      .where(eq(flashcard_items.set_id, setId));

    const existingIds = new Set(existingItems.map((i) => i.id));
    const incomingIds = new Set(
      validCards.map((c) => c.id).filter((id): id is string => !!id)
    );

    // Xoá cards bị remove
    const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
    if (toDelete.length > 0) {
      await db
        .delete(flashcard_items)
        .where(inArray(flashcard_items.id, toDelete));
    }

    // Upsert từng card
    for (const [idx, card] of validCards.entries()) {
      if (card.id && existingIds.has(card.id)) {
        // Update
        await db
          .update(flashcard_items)
          .set({
            front: card.front.trim(),
            back: card.back.trim(),
            image_url: card.imageUrl?.trim() || null,
            order_index: idx,
          })
          .where(eq(flashcard_items.id, card.id));
      } else {
        // Insert mới
        await db.insert(flashcard_items).values({
          set_id: setId,
          front: card.front.trim(),
          back: card.back.trim(),
          image_url: card.imageUrl?.trim() || null,
          order_index: idx,
        });
      }
    }

    revalidatePath('/dashboard/flashcards');
    revalidatePath(`/dashboard/flashcards/${setId}`);
    revalidatePath(`/dashboard/flashcards/${setId}/edit`);
    return { success: true, message: 'Cập nhật thành công!', setId };
  } catch (err) {
    console.error('[updateFlashcardSet]', err);
    return { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' };
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function deleteFlashcardSet(
  setId: string
): Promise<FlashcardActionResult> {
  try {
    const userId = await requireAuth();

    const [existing] = await db
      .select({ owner_id: flashcard_sets.owner_id })
      .from(flashcard_sets)
      .where(eq(flashcard_sets.id, setId))
      .limit(1);

    if (!existing) return { success: false, message: 'Không tìm thấy set.' };
    if (existing.owner_id !== userId)
      return { success: false, message: 'Bạn không có quyền xoá set này.' };

    // Cascade sẽ xoá items, access_log, card_progress
    await db.delete(flashcard_sets).where(eq(flashcard_sets.id, setId));

    revalidatePath('/dashboard/flashcards');
    return { success: true, message: 'Đã xoá bộ thẻ.' };
  } catch (err) {
    console.error('[deleteFlashcardSet]', err);
    return { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại.' };
  }
}

// ─── RECORD ACCESS (dùng cho "Recent") ───────────────────────────────────────

export async function recordSetAccess(setId: string): Promise<void> {
  try {
    const userId = await requireAuth();
    await db.insert(flashcard_access_log).values({
      user_id: userId,
      set_id: setId,
      accessed_at: new Date(),
    });
  } catch {
    // fire-and-forget — không ném lỗi ra ngoài
  }
}

// ─── CARD PROGRESS ────────────────────────────────────────────────────────────

/**
 * Cập nhật status 1 card (optimistic-safe — gọi fire-and-forget từ client).
 * Không cần revalidate vì client tự quản lý state.
 */
export async function updateCardProgress(
  setId: string,
  cardId: string,
  status: 'know' | 'still_learning' | null
): Promise<void> {
  try {
    const userId = await requireAuth();

    await db
      .insert(flashcard_card_progress)
      .values({
        user_id: userId,
        set_id: setId,
        card_id: cardId,
        status,
        updated_at: new Date(),
      })
      .onConflictDoUpdate({
        target: [flashcard_card_progress.user_id, flashcard_card_progress.card_id],
        set: {
          status,
          set_id: setId,
          updated_at: new Date(),
        },
      });
  } catch (err) {
    console.error('[updateCardProgress]', err);
  }
}

/**
 * Bulk update nhiều cards cùng lúc (gọi khi kết thúc session).
 * Cũng xoá progress của các cards không còn trong session (reset từ still_learning → not studied).
 */
export async function bulkUpdateCardProgress(
  setId: string,
  updates: CardProgressUpdate[]
): Promise<void> {
  try {
    const userId = await requireAuth();

    if (updates.length === 0) return;

    // Upsert từng update
    for (const update of updates) {
      await db
        .insert(flashcard_card_progress)
        .values({
          user_id: userId,
          set_id: setId,
          card_id: update.cardId,
          status: update.status,
          updated_at: new Date(),
        })
        .onConflictDoUpdate({
          target: [flashcard_card_progress.user_id, flashcard_card_progress.card_id],
          set: {
            status: update.status,
            set_id: setId,
            updated_at: new Date(),
          },
        });
    }

    // Xoá progress của cards thuộc set này mà KHÔNG có trong updates (reset session)
    const updatedCardIds = updates.map((u) => u.cardId);
    await db
      .delete(flashcard_card_progress)
      .where(
        and(
          eq(flashcard_card_progress.user_id, userId),
          eq(flashcard_card_progress.set_id, setId),
          notInArray(flashcard_card_progress.card_id, updatedCardIds)
        )
      );

    revalidatePath(`/dashboard/flashcards`);
  } catch (err) {
    console.error('[bulkUpdateCardProgress]', err);
  }
}

/**
 * Xóa toàn bộ tiến trình học của user trong bộ thẻ này (reset về ban đầu)
 */
export async function resetSetProgress(setId: string): Promise<void> {
  try {
    const userId = await requireAuth();
    await db
      .delete(flashcard_card_progress)
      .where(
        and(
          eq(flashcard_card_progress.user_id, userId),
          eq(flashcard_card_progress.set_id, setId)
        )
      );
    revalidatePath(`/dashboard/flashcards`);
    revalidatePath(`/dashboard/flashcards/${setId}`);
  } catch (err) {
    console.error('[resetSetProgress]', err);
  }
}

