/**
 * COLOR_PALETTE — Nguồn dữ liệu màu duy nhất cho toàn bộ project.
 *
 * - `name`          : Giá trị được lưu vào DB (cột theme_color).
 * - `bg`            : CSS class nền nhạt (dùng cho badge, icon bg, v.v.)
 * - `text`          : CSS class chữ tương phản trên nền nhạt.
 * - `gradient`      : CSS class gradient đậm (dùng cho avatar, hero, v.v.)
 * - `gradientLight` : CSS class gradient nhạt (dùng cho card background, v.v.)
 *
 * Khi muốn thêm / bớt / sửa màu, chỉ cần chỉnh sửa tại đây.
 */
export const COLOR_PALETTE = [
  {
    name: 'blue',
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    gradient: 'from-blue-500 to-cyan-500',
    gradientLight: 'from-blue-100 to-cyan-100',
  },
  {
    name: 'indigo',
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
    gradient: 'from-indigo-600 to-purple-600',
    gradientLight: 'from-indigo-100 to-purple-100',
  },
  {
    name: 'violet',
    bg: 'bg-violet-100',
    text: 'text-violet-600',
    gradient: 'from-violet-500 to-purple-500',
    gradientLight: 'from-violet-100 to-purple-100',
  },
  {
    name: 'purple',
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    gradient: 'from-purple-500 to-pink-500',
    gradientLight: 'from-purple-100 to-pink-100',
  },
  {
    name: 'cyan',
    bg: 'bg-cyan-100',
    text: 'text-cyan-600',
    gradient: 'from-cyan-400 to-blue-500',
    gradientLight: 'from-cyan-100 to-blue-100',
  },
  {
    name: 'emerald',
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    gradient: 'from-emerald-500 to-teal-500',
    gradientLight: 'from-emerald-100 to-teal-100',
  },
  {
    name: 'green',
    bg: 'bg-green-100',
    text: 'text-green-600',
    gradient: 'from-green-500 to-emerald-500',
    gradientLight: 'from-green-100 to-emerald-100',
  },
  {
    name: 'yellow',
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
    gradient: 'from-yellow-500 to-orange-500',
    gradientLight: 'from-yellow-100 to-orange-100',
  },
  {
    name: 'amber',
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    gradient: 'from-amber-500 to-orange-500',
    gradientLight: 'from-amber-100 to-orange-100',
  },
  {
    name: 'orange',
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    gradient: 'from-orange-500 to-red-500',
    gradientLight: 'from-orange-100 to-red-100',
  },
  {
    name: 'red',
    bg: 'bg-red-100',
    text: 'text-red-600',
    gradient: 'from-red-500 to-rose-500',
    gradientLight: 'from-red-100 to-rose-100',
  },
  {
    name: 'rose',
    bg: 'bg-rose-100',
    text: 'text-rose-600',
    gradient: 'from-rose-500 to-pink-500',
    gradientLight: 'from-rose-100 to-pink-100',
  },
  {
    name: 'black',
    bg: 'bg-gray-900',
    text: 'text-white',
    gradient: 'from-gray-900 to-gray-700',
    gradientLight: 'from-gray-200 to-gray-100',
  },
] as const;

/** Type cho 1 entry màu trong palette */
export type ColorEntry = typeof COLOR_PALETTE[number];

/** Type cho tên màu hợp lệ (union của tất cả các `name`) */
export type ColorName = ColorEntry['name'];

export function getColorClasses(colorName: string | undefined | null): ColorEntry {
  return (
    COLOR_PALETTE.find((c) => c.name === colorName) ??
    COLOR_PALETTE.find((c) => c.name === 'indigo')!
  );
}


// Maps a DB color *name* (e.g. "blue", "yellow") to the hex value used
// throughout the dashboard. Uses Tailwind's 500 shade so it visually matches
// the rest of the UI. Add more keys here as new theme colors appear in the DB.
export const THEME_COLOR_HEX: Record<string, string> = {
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  blue: '#3b82f6',
  sky: '#0ea5e9',
  cyan: '#06b6d4',
  teal: '#14b8a6',
  emerald: '#10b981',
  green: '#22c55e',
  lime: '#84cc16',
  yellow: '#f59e0b',
  amber: '#f59e0b',
  orange: '#f97316',
  red: '#ef4444',
  rose: '#f43f5e',
  pink: '#ec4899',
  fuchsia: '#d946ef',
  slate: '#64748b',
  gray: '#6b7280',
  grey: '#6b7280',
  black: '#111827', // matches COLOR_PALETTE's bg-gray-900
};

// Deterministic fallback for any color name not in the map above, so an
// unexpected value from the DB still renders a stable (not random-per-render)
// color instead of falling through to a default gray for everything.
export const FALLBACK_PALETTE = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#14b8a6', '#f97316', '#a855f7'];
export function hexForThemeColor(themeColor: string | undefined, index: number): string {
  if (!themeColor) return FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
  const key = themeColor.trim().toLowerCase();
  if (THEME_COLOR_HEX[key]) return THEME_COLOR_HEX[key];
  // themeColor might already be a hex string (e.g. "#6366f1") — pass it through.
  if (key.startsWith('#')) return themeColor;
  return FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
}