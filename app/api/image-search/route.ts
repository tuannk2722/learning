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

// ─── Search Pexels ───────────────────────────────────────────────────────────
async function searchPexels(query: string): Promise<ImageSearchResult[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.error('[image-search] PEXELS_API_KEY not set');
    return [];
  }

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`;

  const res = await fetch(url, {
    headers: { Authorization: apiKey },
    signal: AbortSignal.timeout(6000),
  });

  if (!res.ok) {
    console.error('[image-search] Pexels API error:', res.status);
    return [];
  }

  const data = await res.json();

  if (!data.photos || !Array.isArray(data.photos)) return [];

  return data.photos.map((photo: {
    id: number;
    alt: string;
    photographer: string;
    src: { medium: string; large: string };
  }) => ({
    id: photo.id,
    url: photo.src.medium,
    fullUrl: photo.src.large,
    alt: photo.alt || '',
    photographer: photo.photographer || '',
  }));
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

    // Search Pexels with the English query
    const images = await searchPexels(englishQuery);

    return NextResponse.json<ImageSearchResponse>({
      images,
      translatedQuery: englishQuery !== query ? englishQuery : undefined,
    });
  } catch (error) {
    console.error('[image-search]', error);
    return NextResponse.json<ImageSearchResponse>({ images: [] });
  }
}
