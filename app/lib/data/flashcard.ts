import { db } from '../db';
import {
  flashcard_sets,
  flashcard_items,
  flashcard_access_log,
  flashcard_card_progress,
  flashcard_study_sessions,
  users,
} from '../db/schema';
import { eq, and, inArray, notInArray, sql, desc } from 'drizzle-orm';
import { removeAccents } from '../utils/removeAccents';
import type {
  FlashcardSetDTO,
  FlashcardSetForStudy,
  FlashcardItemDTO,
  CardProgressMap,
  StudySessionMeta,
} from '../definitions/flashcards';

/** Chuẩn hoá string để so sánh: bỏ dấu + lowercase */
function normalize(s: string): string {
  return removeAccents(s ?? '');
}

// ─── Query: Danh sách sets cho trang Overview ─────────────────────────────────

// ─── Query: Danh sách sets cho trang Overview ─────────────────────────────────

interface GetFlashcardSetsResult {
  recentSets: FlashcardSetDTO[];
  publicSets: FlashcardSetDTO[];
  totalRecentPages: number;
  totalRecentSets: number;
}

export async function getFlashcardSets(
  userId: string,
  q: string = '',
  page: number = 1,
  limit: number = 5
): Promise<GetFlashcardSetsResult> {
  const normalQ = normalize(q);

  // 1. Lấy recent access log của user (1 query)
  const recentAccessRows = await db
    .select({
      set_id: flashcard_access_log.set_id,
      last_accessed: sql<Date>`MAX(${flashcard_access_log.accessed_at})`.as('last_accessed'),
    })
    .from(flashcard_access_log)
    .where(eq(flashcard_access_log.user_id, userId))
    .groupBy(flashcard_access_log.set_id)
    .orderBy(sql`MAX(${flashcard_access_log.accessed_at}) DESC`);

  const recentSetIds = recentAccessRows.map((r) => r.set_id);
  const recentAccessMap = new Map(
    recentAccessRows.map((r) => [r.set_id, r.last_accessed])
  );

  // 2. Subquery đếm card per set — nhúng trực tiếp vào JOIN, không tốn thêm round-trip
  const cardCountSq = db
    .select({
      set_id: flashcard_items.set_id,
      count: sql<number>`COUNT(*)::int`.as('count'),
    })
    .from(flashcard_items)
    .groupBy(flashcard_items.set_id)
    .as('card_counts');

  type SetRow = {
    id: string;
    owner_id: string;
    title: string;
    description: string | null;
    is_public: boolean;
    tags: string[] | null;
    created_at: Date | null;
    owner_name: string;
    owner_avatar: string | null;
    card_count: number;
  };

  // Select shape dùng chung cho cả 2 queries
  const selectShape = {
    id: flashcard_sets.id,
    owner_id: flashcard_sets.owner_id,
    title: flashcard_sets.title,
    description: flashcard_sets.description,
    is_public: flashcard_sets.is_public,
    tags: flashcard_sets.tags,
    created_at: flashcard_sets.created_at,
    owner_name: users.name,
    owner_avatar: users.avatar_url,
    card_count: sql<number>`COALESCE(${cardCountSq.count}, 0)`.as('card_count'),
  };

  // 3. Chạy song song 2 queries (giảm từ 5 queries xuống còn 3 round-trips)
  const publicWhereConditions = [eq(flashcard_sets.is_public, true)];
  if (recentSetIds.length > 0) {
    publicWhereConditions.push(notInArray(flashcard_sets.id, recentSetIds) as any);
  }

  const [recentRaw, publicRaw] = await Promise.all([
    recentSetIds.length > 0
      ? db
          .select(selectShape)
          .from(flashcard_sets)
          .innerJoin(users, eq(flashcard_sets.owner_id, users.id))
          .leftJoin(cardCountSq, eq(flashcard_sets.id, cardCountSq.set_id))
          .where(inArray(flashcard_sets.id, recentSetIds))
      : Promise.resolve([] as SetRow[]),
    db
      .select(selectShape)
      .from(flashcard_sets)
      .innerJoin(users, eq(flashcard_sets.owner_id, users.id))
      .leftJoin(cardCountSq, eq(flashcard_sets.id, cardCountSq.set_id))
      .where(and(...publicWhereConditions))
      .orderBy(desc(flashcard_sets.created_at)),
  ]);

  // 4. Filter theo q in-memory (vì cần removeAccents tiếng Việt, DB không hỗ trợ natively)
  const filterRows = (rows: SetRow[]) => {
    if (!normalQ) return rows;
    return rows.filter((s) => {
      const titleN = normalize(s.title);
      const descN = normalize(s.description ?? '');
      const tagsN = (s.tags ?? []).map(normalize).join(' ');
      return (
        titleN.includes(normalQ) ||
        descN.includes(normalQ) ||
        tagsN.includes(normalQ)
      );
    });
  };

  // 5. Sort recent theo last_accessed giảm dần
  const filteredRecent = filterRows(recentRaw as SetRow[]).sort((a, b) => {
    const aTime = new Date(recentAccessMap.get(a.id) ?? 0).getTime();
    const bTime = new Date(recentAccessMap.get(b.id) ?? 0).getTime();
    return bTime - aTime;
  });

  const totalRecentSets = filteredRecent.length;
  const totalRecentPages = Math.max(1, Math.ceil(totalRecentSets / limit));
  const validPage = Math.max(1, Math.min(page, totalRecentPages));
  const startIndex = (validPage - 1) * limit;
  const paginatedRecent = filteredRecent.slice(startIndex, startIndex + limit);

  const filteredPublic = filterRows(publicRaw as SetRow[]);

  // 6. Map sang DTO — synchronous, không cần thêm DB query
  const toDTO = (rows: SetRow[], accessMap?: Map<string, Date>): FlashcardSetDTO[] =>
    rows.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      isPublic: s.is_public,
      tags: s.tags ?? [],
      cardCount: s.card_count,
      createdAt: s.created_at!,
      lastAccessed: accessMap?.get(s.id) ?? null,
      ownerId: s.owner_id,
      ownerName: s.owner_name,
      ownerAvatar: s.owner_avatar,
    }));

  return {
    recentSets: toDTO(paginatedRecent, recentAccessMap),
    publicSets: toDTO(filteredPublic),
    totalRecentPages,
    totalRecentSets,
  };
}

// ─── Query: Set chi tiết cho trang Study / Edit ───────────────────────────────

export async function getFlashcardSetById(
  setId: string,
  userId: string
): Promise<{
  set: FlashcardSetForStudy;
  cardProgress: CardProgressMap;
  studySession: StudySessionMeta | null;
  isOwner: boolean;
} | null> {
  const [setRow] = await db
    .select({
      id: flashcard_sets.id,
      owner_id: flashcard_sets.owner_id,
      title: flashcard_sets.title,
      description: flashcard_sets.description,
      is_public: flashcard_sets.is_public,
      tags: flashcard_sets.tags,
    })
    .from(flashcard_sets)
    .where(eq(flashcard_sets.id, setId))
    .limit(1);

  if (!setRow) return null;

  const isOwner = setRow.owner_id === userId;
  // Non-owner chỉ có thể xem public sets
  if (!isOwner && !setRow.is_public) return null;

  const [items, progressRows, sessionRow] = await Promise.all([
    db
      .select()
      .from(flashcard_items)
      .where(eq(flashcard_items.set_id, setId))
      .orderBy(flashcard_items.order_index),
    db
      .select({
        card_id: flashcard_card_progress.card_id,
        status: flashcard_card_progress.status,
      })
      .from(flashcard_card_progress)
      .where(
        and(
          eq(flashcard_card_progress.user_id, userId),
          eq(flashcard_card_progress.set_id, setId)
        )
      ),
    db
      .select({
        track_progress: flashcard_study_sessions.track_progress,
        last_card_index: flashcard_study_sessions.last_card_index,
      })
      .from(flashcard_study_sessions)
      .where(
        and(
          eq(flashcard_study_sessions.user_id, userId),
          eq(flashcard_study_sessions.set_id, setId)
        )
      )
      .limit(1),
  ]);

  const cardProgress: CardProgressMap = {};
  for (const row of progressRows) {
    cardProgress[row.card_id] = row.status as 'know' | 'still_learning';
  }

  const studySession: StudySessionMeta | null = sessionRow[0]
    ? {
        trackProgress: sessionRow[0].track_progress,
        lastCardIndex: sessionRow[0].last_card_index,
      }
    : null;

  const set: FlashcardSetForStudy = {
    id: setRow.id,
    title: setRow.title,
    description: setRow.description,
    isPublic: setRow.is_public,
    tags: setRow.tags ?? [],
    cards: items.map(
      (item): FlashcardItemDTO => ({
        id: item.id,
        front: item.front,
        back: item.back,
        imageUrl: item.image_url,
        orderIndex: item.order_index,
      })
    ),
  };

  return { set, cardProgress, studySession, isOwner };
}

// ─── Query: Set chi tiết cho Builder (Edit page) ──────────────────────────────

export async function getFlashcardSetForEdit(setId: string, userId: string) {
  const result = await getFlashcardSetById(setId, userId);
  if (!result || !result.isOwner) return null;
  return result.set;
}
