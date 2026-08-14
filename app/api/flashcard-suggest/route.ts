import { NextRequest, NextResponse } from 'next/server';
import { toBcp47Base, isSameBaseLanguage } from '@/app/lib/constants/languages';

export interface SuggestionItem {
  text: string;
  type: 'definition' | 'translation';
  partOfSpeech?: string;
  example?: string;
  sourceDefinition?: string;
}

interface SuggestResponse {
  suggestions: SuggestionItem[];
}

// ─── Dictionary lookup (Free Dictionary API) ────────────────────────────────
async function fetchDictionaryDefinitions(
  word: string,
  langCode: string,
): Promise<SuggestionItem[]> {
  const base = toBcp47Base(langCode);

  // Free Dictionary API chỉ hỗ trợ English
  if (base !== 'en') return [];

  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) return [];

  const data = await res.json();

  const suggestions: SuggestionItem[] = [];

  // data là mảng entries, mỗi entry có mảng meanings
  for (const entry of data) {
    if (!entry.meanings) continue;
    for (const meaning of entry.meanings) {
      const partOfSpeech = meaning.partOfSpeech ?? undefined;
      for (const def of meaning.definitions ?? []) {
        if (!def.definition) continue;
        suggestions.push({
          text: def.definition,
          type: 'definition',
          partOfSpeech,
          example: def.example ?? undefined,
        });

        // Giới hạn 8 definitions cho gọn
        if (suggestions.length >= 8) return suggestions;
      }
    }
  }

  return suggestions;
}

// ─── Translation lookup (MyMemory API) ───────────────────────────────────────
async function fetchTranslation(
  text: string,
  fromLang: string,
  toLang: string,
): Promise<SuggestionItem[]> {
  const src = toBcp47Base(fromLang);
  const tgt = toBcp47Base(toLang);

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${src}|${tgt}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) return [];

  const data = await res.json();
  const suggestions: SuggestionItem[] = [];

  // Main translation
  const mainTranslation = data?.responseData?.translatedText;
  if (mainTranslation && mainTranslation.toLowerCase() !== text.toLowerCase()) {
    suggestions.push({
      text: mainTranslation,
      type: 'translation',
    });
  }

  // Alternative matches from translation memory
  const matches = data?.matches;
  if (Array.isArray(matches)) {
    for (const match of matches) {
      const translated = match.translation;
      if (
        translated &&
        translated.toLowerCase() !== text.toLowerCase() &&
        !suggestions.some((s) => s.text.toLowerCase() === translated.toLowerCase())
      ) {
        suggestions.push({
          text: translated,
          type: 'translation',
        });
      }
      if (suggestions.length >= 5) break;
    }
  }

  return suggestions;
}

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const term = searchParams.get('term')?.trim();
    const termLang = searchParams.get('termLang') ?? 'en-US';
    const defLang = searchParams.get('defLang') ?? 'en-US';

    if (!term || term.length < 2) {
      return NextResponse.json<SuggestResponse>({ suggestions: [] });
    }

    const sameLang = isSameBaseLanguage(termLang, defLang);

    if (sameLang) {
      // ── Case 1: Same language → Dictionary lookup ──
      const definitions = await fetchDictionaryDefinitions(term, termLang);
      return NextResponse.json<SuggestResponse>({ suggestions: definitions });
    } else {
      // ── Case 2: Different languages → Translation ──
      // Gọi translation song song với dictionary (nếu term là English)
      const isTermEnglish = toBcp47Base(termLang) === 'en';

      const [translations, definitions] = await Promise.all([
        fetchTranslation(term, termLang, defLang),
        isTermEnglish ? fetchDictionaryDefinitions(term, termLang) : Promise.resolve([]),
      ]);

      // Gắn sourceDefinition từ dictionary vào translation item đầu tiên
      if (translations.length > 0 && definitions.length > 0) {
        translations[0].sourceDefinition = definitions[0].text;
      }

      return NextResponse.json<SuggestResponse>({ suggestions: translations });
    }
  } catch (error) {
    console.error('[flashcard-suggest]', error);
    return NextResponse.json<SuggestResponse>({ suggestions: [] });
  }
}
