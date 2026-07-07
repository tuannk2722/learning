
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
