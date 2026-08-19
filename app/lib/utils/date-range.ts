
export async function getVNDateString(date: Date): Promise<string> {
  const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
  const vnDate = new Date(date.getTime() + VN_OFFSET_MS);
  return vnDate.toISOString().split('T')[0];
}

export function getDateLabel(date: Date): string {
  const now = new Date();

  // Reset time to midnight for comparison
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);

  const today = new Date(now.getTime());
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today.getTime());
  yesterday.setDate(yesterday.getDate() - 1);

  const diffTime = today.getTime() - d.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}


export type TimeRange = '7d' | '30d' | '90d' | '1y';

export interface DateBucket {
  key: string;       // Key để match với SQL query result (vd: '2026-08-19', 'W1', '2026-08')
  label: string;     // Nhãn hiển thị trên trục X của Recharts (vd: 'Mon', '19/08', 'W1', 'Aug')
  startDate?: Date;
  endDate?: Date;
}

export interface TimeRangeConfig {
  range: TimeRange;
  days: number;
  granularity: 'day' | 'week' | 'biweek' | 'month';
  startDate: Date;
  endDate: Date;
}

/**
 * Format Date thành string YYYY-MM-DD theo local timezone (tránh lệch ngày do UTC)
 */
export function formatLocalDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Chuẩn hoá và lấy cấu hình khoảng thời gian
 */
export function getTimeRangeConfig(rangeInput?: string | null): TimeRangeConfig {
  const range: TimeRange =
    rangeInput === '30d' || rangeInput === '90d' || rangeInput === '1y'
      ? rangeInput
      : '7d';

  const now = new Date();
  let days = 7;
  let granularity: 'day' | 'week' | 'biweek' | 'month' = 'day';

  switch (range) {
    case '30d':
      days = 30;
      granularity = 'week'; // ~4-5 điểm
      break;
    case '90d':
      days = 90;
      granularity = 'biweek'; // ~6-7 điểm (mỗi 2 tuần)
      break;
    case '1y':
      days = 365;
      granularity = 'month'; // 12 điểm
      break;
    case '7d':
    default:
      days = 7;
      granularity = 'day'; // 7 điểm
      break;
  }

  const endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date(now);
  startDate.setDate(now.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);

  return {
    range,
    days,
    granularity,
    startDate,
    endDate,
  };
}

/**
 * Sinh danh sách các bucket chuẩn (Zero-filling) cho Recharts
 */
export function generateDateBuckets(rangeInput?: string | null): DateBucket[] {
  const { range, days, granularity, startDate } = getTimeRangeConfig(rangeInput);
  const buckets: DateBucket[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (granularity === 'day') {
    // 7d: 7 điểm, nhãn là tên ngày trong tuần
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = formatLocalDate(d);
      buckets.push({
        key: dateStr,
        label: range === '7d' ? dayNames[d.getDay()] : `${d.getDate()}/${d.getMonth() + 1}`,
      });
    }
  } else if (granularity === 'week') {
    // 30d: ~4-5 tuần, nhãn ngắn gọn "W1 (19/8)"
    const totalWeeks = Math.ceil(days / 7);
    for (let i = 0; i < totalWeeks; i++) {
      const wStart = new Date(startDate);
      wStart.setDate(startDate.getDate() + i * 7);
      wStart.setHours(0, 0, 0, 0);

      const wEnd = new Date(wStart);
      wEnd.setDate(wStart.getDate() + 6);
      wEnd.setHours(23, 59, 59, 999);

      buckets.push({
        key: `W${i + 1}`,
        label: `${wStart.getDate()}/${wStart.getMonth() + 1}`,
        startDate: wStart,
        endDate: wEnd,
      });
    }
  } else if (granularity === 'biweek') {
    // 90d: ~6-7 bi-weeks (mỗi 2 tuần = 14 ngày)
    const stepDays = 14;
    const totalBiWeeks = Math.ceil(days / stepDays);
    for (let i = 0; i < totalBiWeeks; i++) {
      const wStart = new Date(startDate);
      wStart.setDate(startDate.getDate() + i * stepDays);
      wStart.setHours(0, 0, 0, 0);

      const wEnd = new Date(wStart);
      wEnd.setDate(wStart.getDate() + stepDays - 1);
      wEnd.setHours(23, 59, 59, 999);

      buckets.push({
        key: `BW${i + 1}`,
        label: `${wStart.getDate()}/${wStart.getMonth() + 1}`,
        startDate: wStart,
        endDate: wEnd,
      });
    }
  } else if (granularity === 'month') {
    // 1y: 12 tháng, nhãn là tên tháng
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yyyyMm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      buckets.push({
        key: yyyyMm,
        label: monthNames[d.getMonth()],
      });
    }
  }

  return buckets;
}

/**
 * Kiểm tra xem một ngày có thuộc bucket cụ thể hay không (chuẩn hoá timezone)
 */
export function matchDateToBucket(
  dateInput: string | Date | null | undefined,
  bucket: DateBucket,
  granularity: 'day' | 'week' | 'biweek' | 'month'
): boolean {
  if (!dateInput) return false;

  // Nếu là chuỗi dạng 'YYYY-MM-DD' từ SQL to_char
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    if (granularity === 'day') {
      return dateInput === bucket.key;
    }
    if (granularity === 'month') {
      return dateInput.substring(0, 7) === bucket.key;
    }
    if ((granularity === 'week' || granularity === 'biweek') && bucket.startDate && bucket.endDate) {
      const [y, m, d] = dateInput.split('-').map(Number);
      const targetTime = new Date(y, m - 1, d, 12, 0, 0).getTime();
      return targetTime >= bucket.startDate.getTime() && targetTime <= bucket.endDate.getTime();
    }
  }

  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return false;

  if (granularity === 'day') {
    return formatLocalDate(d) === bucket.key;
  }
  if (granularity === 'month') {
    const yyyyMm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return yyyyMm === bucket.key;
  }
  if ((granularity === 'week' || granularity === 'biweek') && bucket.startDate && bucket.endDate) {
    const time = d.getTime();
    return time >= bucket.startDate.getTime() && time <= bucket.endDate.getTime();
  }
  return false;
}
