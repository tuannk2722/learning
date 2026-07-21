import { db } from '../db';
import {
  flashcard_sets,
  flashcard_items,
  flashcard_access_log,
  flashcard_card_progress,
  users,
} from '../db/schema';
import { eq, and, inArray, notInArray, sql, desc, ilike, or } from 'drizzle-orm';
import { removeAccents } from '../utils/removeAccents';
import type {
  FlashcardSetDTO,
  FlashcardSetForStudy,
  FlashcardItemDTO,
  CardProgressMap,
} from '../definitions/flashcards';

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Chuẩn hoá string để so sánh: bỏ dấu + lowercase */
function normalize(s: string): string {
  return removeAccents(s ?? '');
}

// ─── Query: Danh sách sets cho trang Overview ─────────────────────────────────

interface GetFlashcardSetsResult {
  recentSets: FlashcardSetDTO[];
  publicSets: FlashcardSetDTO[];
  allTags: string[];
}

export async function getFlashcardSets(
  userId: string,
  q: string = '',
  tag: string = 'all'
): Promise<GetFlashcardSetsResult> {
  const normalQ = normalize(q);

  // 1. Lấy recent set ids của user (dùng max accessed_at per set)
  const recentAccessRows = await db
    .select({
      set_id: flashcard_access_log.set_id,
      last_accessed: sql<Date>`MAX(${flashcard_access_log.accessed_at})`.as('last_accessed'),
    })
    .from(flashcard_access_log)
    .where(eq(flashcard_access_log.user_id, userId))
    .groupBy(flashcard_access_log.set_id)
    .orderBy(sql`MAX(${flashcard_access_log.accessed_at}) DESC`)
    .limit(10);

  const recentSetIds = recentAccessRows.map((r) => r.set_id);
  const recentAccessMap = new Map(
    recentAccessRows.map((r) => [r.set_id, r.last_accessed])
  );

  type SetRow = {
    id: string;
    owner_id: string;
    title: string;
    description: string | null;
    is_public: boolean;
    theme_color: string | null;
    tags: string[] | null;
    created_at: Date | null;
    owner_name: string;
    owner_avatar: string | null;
  };

  // 2. Hàm build DTO từ raw row
  const buildDTO = async (
    rawSets: SetRow[],
    accessMap?: Map<string, Date>
  ): Promise<FlashcardSetDTO[]> => {
    if (rawSets.length === 0) return [];

    const setIds = rawSets.map((s) => s.id);

    // Đếm số cards per set
    const cardCounts = await db
      .select({
        set_id: flashcard_items.set_id,
        count: sql<number>`COUNT(*)::int`.as('count'),
      })
      .from(flashcard_items)
      .where(inArray(flashcard_items.set_id, setIds))
      .groupBy(flashcard_items.set_id);

    const cardCountMap = new Map(cardCounts.map((c) => [c.set_id, c.count]));

    // Đếm số cards "know" của session gần nhất (theo set_id + user_id)
    const masteredCounts = await db
      .select({
        set_id: flashcard_card_progress.set_id,
        count: sql<number>`COUNT(*)::int`.as('count'),
      })
      .from(flashcard_card_progress)
      .where(
        and(
          eq(flashcard_card_progress.user_id, userId),
          inArray(flashcard_card_progress.set_id, setIds),
          eq(flashcard_card_progress.status, 'know')
        )
      )
      .groupBy(flashcard_card_progress.set_id);

    const masteredMap = new Map(masteredCounts.map((m) => [m.set_id, m.count]));

    return rawSets.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      isPublic: s.is_public,
      themeColor: s.theme_color ?? 'blue',
      tags: s.tags ?? [],
      cardCount: cardCountMap.get(s.id) ?? 0,
      masteredCount: masteredMap.get(s.id) ?? 0,
      createdAt: s.created_at!,
      lastAccessed: accessMap?.get(s.id) ?? null,
      ownerId: s.owner_id,
      ownerName: s.owner_name,
      ownerAvatar: s.owner_avatar,
    }));
  };

  // 3. Query recent sets (gồm cả set của chính user + sets mà user đã truy cập)
  let recentRaw: SetRow[] = [];
  if (recentSetIds.length > 0) {
    recentRaw = await db
      .select({
        id: flashcard_sets.id,
        owner_id: flashcard_sets.owner_id,
        title: flashcard_sets.title,
        description: flashcard_sets.description,
        is_public: flashcard_sets.is_public,
        theme_color: flashcard_sets.theme_color,
        tags: flashcard_sets.tags,
        created_at: flashcard_sets.created_at,
        owner_name: users.name,
        owner_avatar: users.avatar_url,
      })
      .from(flashcard_sets)
      .innerJoin(users, eq(flashcard_sets.owner_id, users.id))
      .where(inArray(flashcard_sets.id, recentSetIds));
  }

  // 4. Query public sets (không gồm recentSetIds)
  const publicWhereConditions = [eq(flashcard_sets.is_public, true)];
  if (recentSetIds.length > 0) {
    publicWhereConditions.push(notInArray(flashcard_sets.id, recentSetIds) as any);
  }

  let publicRaw = await db
    .select({
      id: flashcard_sets.id,
      owner_id: flashcard_sets.owner_id,
      title: flashcard_sets.title,
      description: flashcard_sets.description,
      is_public: flashcard_sets.is_public,
      theme_color: flashcard_sets.theme_color,
      tags: flashcard_sets.tags,
      created_at: flashcard_sets.created_at,
      owner_name: users.name,
      owner_avatar: users.avatar_url,
    })
    .from(flashcard_sets)
    .innerJoin(users, eq(flashcard_sets.owner_id, users.id))
    .where(and(...publicWhereConditions))
    .orderBy(desc(flashcard_sets.created_at));

  // 5. Filter theo q (removeAccents) và tag (client-side sau khi query)
  const filterRows = (rows: SetRow[]) => {
    let filtered = rows;

    if (normalQ) {
      filtered = filtered.filter((s) => {
        const titleN = normalize(s.title);
        const descN = normalize(s.description ?? '');
        const tagsN = (s.tags ?? []).map(normalize).join(' ');
        return (
          titleN.includes(normalQ) ||
          descN.includes(normalQ) ||
          tagsN.includes(normalQ)
        );
      });
    }

    if (tag && tag !== 'all') {
      filtered = filtered.filter((s) =>
        (s.tags ?? []).some(
          (t) => normalize(t) === normalize(tag)
        )
      );
    }

    return filtered;
  };

  recentRaw = filterRows(recentRaw);
  publicRaw = filterRows(publicRaw);

  // Sort recent theo last_accessed
  recentRaw.sort((a, b) => {
    const aTime = new Date(recentAccessMap.get(a.id) ?? 0).getTime();
    const bTime = new Date(recentAccessMap.get(b.id) ?? 0).getTime();
    return bTime - aTime;
  });

  const [recentSets, publicSets] = await Promise.all([
    buildDTO(recentRaw, recentAccessMap),
    buildDTO(publicRaw),
  ]);

  // 6. Top 10 tags theo số set nhiều nhất
  const allTagsRaw = await db
    .select({ tags: flashcard_sets.tags })
    .from(flashcard_sets)
    .where(eq(flashcard_sets.is_public, true));

  const tagCountMap = new Map<string, number>();
  for (const row of allTagsRaw) {
    for (const t of row.tags ?? []) {
      const norm = t.trim();
      if (norm) tagCountMap.set(norm, (tagCountMap.get(norm) ?? 0) + 1);
    }
  }

  const allTags = Array.from(tagCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  return { recentSets, publicSets, allTags };
}

// ─── Query: Set chi tiết cho trang Study / Edit ───────────────────────────────

export async function getFlashcardSetById(
  setId: string,
  userId: string
): Promise<{
  set: FlashcardSetForStudy;
  cardProgress: CardProgressMap;
  isOwner: boolean;
} | null> {
  const [setRow] = await db
    .select({
      id: flashcard_sets.id,
      owner_id: flashcard_sets.owner_id,
      title: flashcard_sets.title,
      description: flashcard_sets.description,
      is_public: flashcard_sets.is_public,
      theme_color: flashcard_sets.theme_color,
      tags: flashcard_sets.tags,
    })
    .from(flashcard_sets)
    .where(eq(flashcard_sets.id, setId))
    .limit(1);

  if (!setRow) return null;

  const isOwner = setRow.owner_id === userId;
  // Non-owner chỉ có thể xem public sets
  if (!isOwner && !setRow.is_public) return null;

  const items = await db
    .select()
    .from(flashcard_items)
    .where(eq(flashcard_items.set_id, setId))
    .orderBy(flashcard_items.order_index);

  const progressRows = await db
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
    );

  const cardProgress: CardProgressMap = {};
  for (const row of progressRows) {
    cardProgress[row.card_id] = row.status as 'know' | 'still_learning';
  }

  const set: FlashcardSetForStudy = {
    id: setRow.id,
    title: setRow.title,
    description: setRow.description,
    themeColor: setRow.theme_color ?? 'blue',
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

  return { set, cardProgress, isOwner };
}

// ─── Query: Set chi tiết cho Builder (Edit page) ──────────────────────────────

export async function getFlashcardSetForEdit(setId: string, userId: string) {
  const result = await getFlashcardSetById(setId, userId);
  if (!result || !result.isOwner) return null;
  return result.set;
}
