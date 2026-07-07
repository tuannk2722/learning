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

/**
 * Tra cứu các CSS class tương ứng với tên màu.
 * Trả về màu fallback `indigo` nếu không tìm thấy.
 *
 * @example
 * const { bg, text, gradient } = getColorClasses('blue');
 * // bg = 'bg-blue-100', text = 'text-blue-600', ...
 */
export function getColorClasses(colorName: string | undefined | null): ColorEntry {
  return (
    COLOR_PALETTE.find((c) => c.name === colorName) ??
    COLOR_PALETTE.find((c) => c.name === 'indigo')!
  );
}
