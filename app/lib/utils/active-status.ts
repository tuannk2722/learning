
export function formatLastActive(lastStudyDate: Date | string | null): string {
  if (!lastStudyDate) return 'InActive';

  const date = lastStudyDate instanceof Date ? lastStudyDate : new Date(lastStudyDate);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  if (diffInDays === 1) {
    return '1 day ago';
  }
  return `${diffInDays} days ago`;
}