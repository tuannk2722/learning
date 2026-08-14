/**
 * Danh sách ngôn ngữ được hỗ trợ cho TTS (BCP 47 codes).
 * "name" dùng để hiển thị, "code" là giá trị lưu vào DB và truyền vào speechSynthesis.
 */

export interface Language {
  code: string;
  name: string;
}

export const TOP_LANGUAGES: Language[] = [
  { code: 'en-US', name: 'English' },
  { code: 'vi-VN', name: 'Vietnamese' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'th-TH', name: 'Thai' },
  { code: 'id-ID', name: 'Indonesian' },
  { code: 'ms-MY', name: 'Malay' },
  { code: 'nl-NL', name: 'Dutch' },
  { code: 'pl-PL', name: 'Polish' },
  { code: 'tr-TR', name: 'Turkish' },
  { code: 'sv-SE', name: 'Swedish' },
  { code: 'da-DK', name: 'Danish' },
  { code: 'fi-FI', name: 'Finnish' },
  { code: 'nb-NO', name: 'Norwegian' },
  { code: 'cs-CZ', name: 'Czech' },
  { code: 'hu-HU', name: 'Hungarian' },
  { code: 'ro-RO', name: 'Romanian' },
  { code: 'uk-UA', name: 'Ukrainian' },
  { code: 'el-GR', name: 'Greek' },
  { code: 'he-IL', name: 'Hebrew' },
];

/** Trả về language name từ code, hoặc fallback về code nếu không tìm thấy */
export function getLanguageName(code: string): string {
  return TOP_LANGUAGES.find((l) => l.code === code)?.name ?? code;
}

/**
 * Chuyển BCP 47 code sang ISO 639-1 base code.
 * Ví dụ: 'en-US' → 'en', 'vi-VN' → 'vi', 'zh-CN' → 'zh-CN' (giữ nguyên cho Chinese variants)
 */
export function toBcp47Base(code: string): string {
  // Giữ nguyên zh-CN / zh-TW vì chúng khác nhau hoàn toàn
  if (code.startsWith('zh-')) return code;
  return code.split('-')[0];
}

/**
 * So sánh 2 language codes xem có cùng ngôn ngữ gốc không (bỏ qua region).
 * Ví dụ: 'en-US' vs 'en-GB' → true, 'en-US' vs 'vi-VN' → false
 */
export function isSameBaseLanguage(lang1: string, lang2: string): boolean {
  return toBcp47Base(lang1) === toBcp47Base(lang2);
}
