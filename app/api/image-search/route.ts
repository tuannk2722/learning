import { NextRequest, NextResponse } from 'next/server';
import { toBcp47Base } from '@/app/lib/constants/languages';

export interface ImageSearchResult {
  id: number;
  url: string;       // medium size for grid preview
  fullUrl: string;   // large size to save to card
  alt: string;
  photographer: string;
}

interface ImageSearchResponse {
  images: ImageSearchResult[];
  translatedQuery?: string;
  source?: string;
}

// ─── Translate non-English query to English ──────────────────────────────────
async function translateToEnglish(text: string, fromLang: string): Promise<string> {
  const src = toBcp47Base(fromLang);
  if (src === 'en') return text;

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|en`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return text;

    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    if (translated && translated.toLowerCase() !== text.toLowerCase()) {
      return translated;
    }
  } catch {
    // Fallback to original text
  }

  return text;
}

// ─── Primary: Pixabay API (Photos, Illustrations, Vectors) ───────────────────
async function searchPixabay(query: string): Promise<ImageSearchResult[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) {
    console.warn('[image-search] PIXABAY_API_KEY not configured in .env');
    return [];
  }

  try {
    // image_type=all bao gồm cả photo, illustration, vector rất hợp cho Flashcard
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=all&per_page=24&safesearch=true`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });

    if (!res.ok) {
      console.error(`[image-search] Pixabay API error: HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data.hits || data.hits.length === 0) {
      console.warn('[image-search] Pixabay returned 0 results for:', query);
      return [];
    }

    return data.hits.map((hit: {
      id: number;
      webformatURL: string;
      largeImageURL: string;
      tags: string;
      user: string;
    }, i: number) => ({
      id: i + 1,
      url: hit.webformatURL,
      fullUrl: hit.largeImageURL,
      alt: hit.tags || query,
      photographer: hit.user || 'Pixabay',
    }));
  } catch (err) {
    console.error('[image-search] Pixabay failed:', err);
    return [];
  }
}

// ─── Fallback: Openverse API (Free, No Key, CC-licensed) ─────────────────────
async function searchOpenverse(query: string): Promise<ImageSearchResult[]> {
  try {
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&page_size=20&license_type=commercial,modification`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'LearnQuest/1.0' },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error(`[image-search] Openverse API error: HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      console.warn('[image-search] Openverse returned 0 results for:', query);
      return [];
    }

    return data.results.map((item: {
      id: string;
      url: string;
      thumbnail: string;
      title: string;
      creator: string;
    }, i: number) => ({
      id: i + 1,
      url: item.thumbnail || item.url,
      fullUrl: item.url,
      alt: item.title || query,
      photographer: item.creator || 'Openverse',
    }));
  } catch (err) {
    console.error('[image-search] Openverse failed:', err);
    return [];
  }
}

// ─── Route Handler ───────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const query = searchParams.get('query')?.trim();
    const termLang = searchParams.get('termLang') ?? 'en-US';

    if (!query || query.length < 1) {
      return NextResponse.json<ImageSearchResponse>({ images: [] });
    }

    // Translate to English if needed
    const englishQuery = await translateToEnglish(query, termLang);
    console.log(`[image-search] query="${query}" → englishQuery="${englishQuery}"`);

    let images: ImageSearchResult[] = [];
    let source = 'pixabay';

    // 1. Gọi Pixabay làm nguồn chính
    if (process.env.PIXABAY_API_KEY) {
      images = await searchPixabay(englishQuery);
    }

    // 2. Fallback sang Openverse nếu Pixabay không có kết quả hoặc chưa có key
    if (images.length === 0) {
      console.log('[image-search] Falling back to Openverse...');
      images = await searchOpenverse(englishQuery);
      source = 'openverse';
    }

    console.log(`[image-search] Returning ${images.length} images from ${source}`);

    return NextResponse.json<ImageSearchResponse>({
      images,
      translatedQuery: englishQuery !== query ? englishQuery : undefined,
      source,
    });
  } catch (error) {
    console.error('[image-search] Unhandled error:', error);
    return NextResponse.json<ImageSearchResponse>({ images: [] });
  }
}
