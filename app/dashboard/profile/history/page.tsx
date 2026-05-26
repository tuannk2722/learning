import { auth } from '@/auth';
import { getActivityHistory } from '@/app/lib/data/history';
import { HistoryHeader } from '@/app/ui/history/header';
import { HistoryFilterBar } from '@/app/ui/history/filter-bar';
import { Suspense } from 'react';
import { HistoryTimelineSkeleton } from '@/app/ui/skeleton/skeletons';
import { redirect } from 'next/navigation';

export default async function History() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const events = await getActivityHistory(session.user.id);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <HistoryHeader />

        {/* Content with Filter and Timeline */}
        <Suspense fallback={<HistoryTimelineSkeleton />}>
          <HistoryFilterBar events={events} />
        </Suspense>
      </div>
    </div>
  );
}
