import { db } from '../db';
import {
  flashcard_sets,
  flashcard_items,
  flashcard_access_log,
  flashcard_card_progress,
  flashcard_study_sessions,
  users,
  activity_logs,
} from '../db/schema';
import { eq, and, inArray, notInArray, sql, desc, gte } from 'drizzle-orm';
import { removeAccents } from '../utils/removeAccents';
import type {
  FlashcardSetDTO,
  FlashcardSetForStudy,
  FlashcardItemDTO,
  CardProgressMap,
  StudySessionMeta,
} from '../definitions/flashcards';
import { FlashcardCreationData, SetCreationTrendItem, SetsByTagItem, TopActiveDeckDTO } from '../definitions/definitions';

/** Chuẩn hoá string để so sánh: bỏ dấu + lowercase */
function normalize(s: string): string {
  return removeAccents(s ?? '');
}

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
      last_accessed: flashcard_access_log.accessed_at,
    })
    .from(flashcard_access_log)
    .where(eq(flashcard_access_log.user_id, userId))
    .orderBy(desc(flashcard_access_log.accessed_at));

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
      .orderBy(desc(flashcard_sets.created_at))
      .limit(12),
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

export async function getTotalFlashcardSetsByUserId(userId: string) {
  const total = await db.select({ count: sql<number>`COUNT(*)::int` })
    .from(activity_logs)
    .where(and(
      eq(activity_logs.user_id, userId),
      eq(activity_logs.action, 'COMPLETE_FLASHCARD_SESSION'),
    ));
  return total[0].count;
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
      front_lang: flashcard_sets.front_lang,
      back_lang: flashcard_sets.back_lang,
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
    cardProgress[row.card_id] = row.status as 'correct' | 'incorrect';
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
    frontLang: setRow.front_lang ?? 'en-US',
    backLang: setRow.back_lang ?? 'en-US',
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


// ─── Query: Top active decks cho dashboard admin ──────────────────────────────

export type DeckRow = {
  id: string;
  title: string;
  tags: string[] | null;
  active_users: number;
  sessions: number;
  avg_mastery: number;
};

export const RANK_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e'];

export async function getTopFlashcardSets(): Promise<TopActiveDeckDTO[]> {

  // 1. Biểu thức accuracy cho từng dòng log: ưu tiên metadata.accuracy, fallback
  // 1 (100%) khi allCorrect = true, còn lại NULL (AVG() của Postgres tự bỏ qua NULL)
  const accuracyExpr = sql`
    CASE
      WHEN (${activity_logs.metadata}->>'accuracy') IS NOT NULL
        THEN (${activity_logs.metadata}->>'accuracy')::numeric
      WHEN (${activity_logs.metadata}->>'allCorrect') = 'true'
        THEN 1
      ELSE NULL
    END
  `;

  // Select shape: gộp trực tiếp aggregate vào 1 query duy nhất, không cần
  // round-trip riêng để đếm/tính trung bình
  const selectShape = {
    id: flashcard_sets.id,
    title: flashcard_sets.title,
    tags: flashcard_sets.tags,
    active_users: sql<number>`COUNT(DISTINCT ${activity_logs.user_id})::int`.as('active_users'),
    sessions: sql<number>`COUNT(${activity_logs.id})::int`.as('sessions'),
    avg_mastery: sql<number>`ROUND(COALESCE(AVG(${accuracyExpr}), 0) * 100)::int`.as('avg_mastery'),
  };

  // 2. Join flashcard_sets <-> activity_logs qua entity_id
  const rows = (await db
    .select(selectShape)
    .from(flashcard_sets)
    .innerJoin(
      activity_logs,
      and(
        eq(activity_logs.entity_type, 'flashcard_set'),
        eq(activity_logs.action, 'COMPLETE_FLASHCARD_SESSION'),
        eq(activity_logs.entity_id, sql`${flashcard_sets.id}::text`),
        sql`${activity_logs.created_at} >= CURRENT_DATE - INTERVAL '6 days'`
      )
    )
    .groupBy(flashcard_sets.id, flashcard_sets.title, flashcard_sets.tags)
    .orderBy(desc(sql`COUNT(DISTINCT ${activity_logs.user_id})`))
    .limit(5)) as DeckRow[];

  // 3. Map sang DTO — synchronous, không cần thêm DB query
  const toDTO = (r: DeckRow[]): TopActiveDeckDTO[] =>
    r.map((deck, i) => ({
      id: deck.id,
      title: deck.title,
      subject: deck.tags?.[0] ?? '',
      tags: deck.tags ?? [],
      activeUsers: deck.active_users,
      sessions: deck.sessions,
      avgMastery: deck.avg_mastery,
      gradient: RANK_COLORS[i % RANK_COLORS.length],
    }));

  return toDTO(rows);
}


// ─── Query: Analytics tạo flashcard cho Admin Dashboard ──────────────

export async function getFlashcardCreationData(): Promise<FlashcardCreationData> {
  const now = new Date();
  const fiftySixDaysAgo = new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000);

  // 1. Thống kê xu hướng tạo bộ thẻ theo 8 tuần từ database
  const setsRows = await db
    .select({ createdAt: flashcard_sets.created_at })
    .from(flashcard_sets)
    .where(gte(flashcard_sets.created_at, fiftySixDaysAgo));

  const weeksCount = Array(8).fill(0);
  for (const row of setsRows) {
    if (!row.createdAt) continue;
    const diffMs = now.getTime() - new Date(row.createdAt).getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const weekIdx = Math.floor(diffDays / 7);
    if (weekIdx >= 0 && weekIdx < 8) {
      weeksCount[7 - weekIdx] += 1;
    }
  }

  const setCreationTrend: SetCreationTrendItem[] = weeksCount.map((count, i) => ({
    week: `W${i + 1}`,
    sets: count,
  }));

  // 2. Thống kê số lượng bộ thẻ được tạo theo tags từ database
  const tagRows = await db
    .select({
      tag: sql<string>`COALESCE(${flashcard_sets.tags}[1], 'General')`.as('tag'),
      count: sql<number>`COUNT(${flashcard_sets.id})::int`.as('count'),
    })
    .from(flashcard_sets)
    .groupBy(sql`COALESCE(${flashcard_sets.tags}[1], 'General')`)
    .orderBy(desc(sql`COUNT(${flashcard_sets.id})`))
    .limit(5);

  const maxCount = Math.max(...tagRows.map((r) => Number(r.count) || 0), 1);

  const setsByTag: SetsByTagItem[] = tagRows.map((row, i) => {
    const count = Number(row.count) || 0;
    const pct = Math.round((count / maxCount) * 100);

    return {
      tag: row.tag,
      count,
      pct,
      fill: RANK_COLORS[i % RANK_COLORS.length],
    };
  });

  return {
    setCreationTrend,
    setsByTag,
  };
}

// ─── Recommendation System ─────────────────────────────────────────────────────

/**
 * Gợi ý các flashcard sets phù hợp với sở thích của user.
 * - Nếu có interestTags: ưu tiên sets có tags trùng nhiều nhất.
 * - Fallback: trả về các public sets mới nhất chưa access.
 */
export async function getRecommendedFlashcardSets(
  userId: string,
  interestTags: string[],
  limit = 8,
): Promise<FlashcardSetDTO[]> {
  try {
    const cardCountSq = db
      .select({
        set_id: flashcard_items.set_id,
        count: sql<number>`COUNT(*)::int`.as('count'),
      })
      .from(flashcard_items)
      .groupBy(flashcard_items.set_id)
      .as('card_counts');

    const accessedIds = await db
      .select({ set_id: flashcard_access_log.set_id })
      .from(flashcard_access_log)
      .where(eq(flashcard_access_log.user_id, userId));
    const accessedSetIds = accessedIds.map((r) => r.set_id);

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

    const baseWhere = accessedSetIds.length > 0
      ? and(eq(flashcard_sets.is_public, true), notInArray(flashcard_sets.id, accessedSetIds) as any)
      : eq(flashcard_sets.is_public, true);

    if (interestTags.length === 0) {
      const rows = await db
        .select({
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
        })
        .from(flashcard_sets)
        .innerJoin(users, eq(flashcard_sets.owner_id, users.id))
        .leftJoin(cardCountSq, eq(flashcard_sets.id, cardCountSq.set_id))
        .where(baseWhere)
        .orderBy(desc(flashcard_sets.created_at))
        .limit(limit) as SetRow[];

      return rows.map((s) => ({
        id: s.id, title: s.title, description: s.description,
        isPublic: s.is_public, tags: s.tags ?? [], cardCount: s.card_count,
        createdAt: s.created_at!, lastAccessed: null,
        ownerId: s.owner_id, ownerName: s.owner_name, ownerAvatar: s.owner_avatar,
      }));
    }

    // Đã lowercase từ getUserInterestTags, đảm bảo luôn lowercase khi build param
    const tagsParam = `{${interestTags.map((t) => `"${t.toLowerCase().replace(/"/g, '\\"')}"`).join(',')}}`;

    const rows = await db
      .select({
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
        recommendation_score: sql<number>`
          CARDINALITY(
            ARRAY(
              SELECT LOWER(UNNEST(${flashcard_sets.tags}))
              INTERSECT
              SELECT UNNEST(${sql.raw(`'${tagsParam}'::text[]`)})
            )
          )
        `.as('recommendation_score'),
      })
      .from(flashcard_sets)
      .innerJoin(users, eq(flashcard_sets.owner_id, users.id))
      .leftJoin(cardCountSq, eq(flashcard_sets.id, cardCountSq.set_id))
      .where(and(
        baseWhere as any,
        // So sánh không phân biệt hoa/thường: LOWER từng phần tử trước khi &&
        sql`(SELECT ARRAY_AGG(LOWER(v)) FROM UNNEST(${flashcard_sets.tags}) AS v) && ${sql.raw(`'${tagsParam}'::text[]`)}`,
      ))
      .orderBy(desc(sql`recommendation_score`), desc(flashcard_sets.created_at))
      .limit(limit) as (SetRow & { recommendation_score: number })[];

    return rows.map((s) => ({
      id: s.id, title: s.title, description: s.description,
      isPublic: s.is_public, tags: s.tags ?? [], cardCount: s.card_count,
      createdAt: s.created_at!, lastAccessed: null,
      ownerId: s.owner_id, ownerName: s.owner_name, ownerAvatar: s.owner_avatar,
    }));
  } catch (error) {
    console.error('getRecommendedFlashcardSets error:', error);
    return [];
  }
}

// ─── Shared: Mastery data per set ─────────────────────────────────────────────
//
// pct = correctCards / totalCards (số thẻ đúng / tổng số thẻ trong bộ)
// Dùng chung cho cả dashboard RecentFlashcards và analytics SetMastery chart.

export interface FlashcardSetProgressDTO {
  id: string;
  title: string;
  correctCards: number;
  totalCards: number;
  pct: number; // = round(correctCards / totalCards * 100)
}

/**
 * Tính mastery (correct/totalCards) cho danh sách setIds cho trước.
 * Hàm không lọc theo owner — caller tự truyền đúng setIds.
 */
export async function getSetsMasteryByIds(
  userId: string,
  setIds: string[]
): Promise<FlashcardSetProgressDTO[]> {
  if (setIds.length === 0) return [];

  const totalCardsSq = db
    .select({
      setId: flashcard_items.set_id,
      totalCards: sql<number>`COUNT(*)::int`.as('total_cards'),
    })
    .from(flashcard_items)
    .where(inArray(flashcard_items.set_id, setIds))
    .groupBy(flashcard_items.set_id)
    .as('total_sq');

  const correctCardsSq = db
    .select({
      setId: flashcard_card_progress.set_id,
      correctCards: sql<number>`COUNT(*)::int`.as('correct_cards'),
    })
    .from(flashcard_card_progress)
    .where(
      and(
        eq(flashcard_card_progress.user_id, userId),
        eq(flashcard_card_progress.status, 'correct'),
        inArray(flashcard_card_progress.set_id, setIds)
      )
    )
    .groupBy(flashcard_card_progress.set_id)
    .as('correct_sq');

  const rows = await db
    .select({
      id: flashcard_sets.id,
      title: flashcard_sets.title,
      totalCards: sql<number>`COALESCE(${totalCardsSq.totalCards}, 0)`.as('total_cards'),
      correctCards: sql<number>`COALESCE(${correctCardsSq.correctCards}, 0)`.as('correct_cards'),
    })
    .from(flashcard_sets)
    .leftJoin(totalCardsSq, eq(flashcard_sets.id, totalCardsSq.setId))
    .leftJoin(correctCardsSq, eq(flashcard_sets.id, correctCardsSq.setId))
    .where(inArray(flashcard_sets.id, setIds));

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    correctCards: row.correctCards,
    totalCards: row.totalCards,
    pct: row.totalCards > 0 ? Math.round((row.correctCards / row.totalCards) * 100) : 0,
  }));
}

// ─── Query: 3 sets user học gần nhất chưa hoàn thành / chưa restart ──────────

export async function getRecentUnfinishedFlashcards(
  userId: string,
  limit: number = 3
): Promise<FlashcardSetProgressDTO[]> {
  if (!userId) return [];

  // 1. Recent access log (ordered by access time), lấy tối đa 20 để sau lọc
  const recentLogs = await db
    .select({ setId: flashcard_access_log.set_id })
    .from(flashcard_access_log)
    .where(eq(flashcard_access_log.user_id, userId))
    .orderBy(desc(flashcard_access_log.accessed_at))
    .limit(20);

  if (recentLogs.length === 0) return [];

  const setIds = recentLogs.map((l) => l.setId);

  // 2. Xác định sets "đang học dở":
  //    - lastCardIndex > 0 (track_progress=OFF, đang học dở giữa chừng)
  //    - progCount > 0     (track_progress=ON, đã đánh dấu ít nhất 1 thẻ)
  //    Sau restart, cả hai đều = 0 → set đó bị loại.
  const progressCountSq = db
    .select({
      setId: flashcard_card_progress.set_id,
      progCount: sql<number>`COUNT(*)::int`.as('prog_count'),
    })
    .from(flashcard_card_progress)
    .where(
      and(
        eq(flashcard_card_progress.user_id, userId),
        inArray(flashcard_card_progress.set_id, setIds)
      )
    )
    .groupBy(flashcard_card_progress.set_id)
    .as('prog_sq');

  const sessionRows = await db
    .select({
      setId: flashcard_sets.id,
      lastCardIndex: flashcard_study_sessions.last_card_index,
      progCount: sql<number>`COALESCE(${progressCountSq.progCount}, 0)`.as('prog_count'),
    })
    .from(flashcard_sets)
    .leftJoin(
      flashcard_study_sessions,
      and(
        eq(flashcard_study_sessions.set_id, flashcard_sets.id),
        eq(flashcard_study_sessions.user_id, userId)
      )
    )
    .leftJoin(progressCountSq, eq(flashcard_sets.id, progressCountSq.setId))
    .where(inArray(flashcard_sets.id, setIds));

  const unfinishedSetIds = sessionRows
    .filter((s) => (s.lastCardIndex ?? 0) > 0 || (s.progCount ?? 0) > 0)
    .map((s) => s.setId);

  if (unfinishedSetIds.length === 0) return [];

  // 3. Lấy mastery data qua hàm dùng chung (pct = correct/totalCards)
  const masteryList = await getSetsMasteryByIds(userId, unfinishedSetIds);
  const masteryMap = new Map(masteryList.map((m) => [m.id, m]));

  // 4. Giữ nguyên thứ tự theo access log, cắt đúng limit
  const result: FlashcardSetProgressDTO[] = [];
  for (const log of recentLogs) {
    const mastery = masteryMap.get(log.setId);
    if (!mastery) continue;
    result.push(mastery);
    if (result.length >= limit) break;
  }

  return result;
}


