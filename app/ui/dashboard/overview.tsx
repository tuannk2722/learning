import {
  ClockIcon,
  CheckCircleIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '../fonts';


export default async function CardWrapper() {
  return (
    <>
      {/* NOTE: Uncomment this code in Chapter 9 */}

      {/* <Card title="Collected" value={totalPaidInvoices} type="collected" />
      <Card title="Pending" value={totalPendingInvoices} type="pending" />
      <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
      <Card
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
      /> */}
    </>
  );
}

const iconMap = {
  'Day Streak': FireIcon,
  'Total Study Time': ClockIcon,
  'Sessions Completed': CheckCircleIcon,
}

const cardStyle = {
  'Day Streak': {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
  },
  'Total Study Time': {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
  },
  'Sessions Completed': {
    bg: 'bg-green-100',
    text: 'text-green-600',
  },
};

export function OverviewCard({
  type,
  value,
  title,
}: {
  type: 'Day Streak' | 'Total Study Time' | 'Sessions Completed';
  value: number | string;
  title: string;
}) {
  const Icon = iconMap[type];
  const style = cardStyle[type];

  return (
    <div className="rounded-xl bg-white p-2 shadow-sm hover:shadow-md transition">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>

        {/* Icon */}
        {Icon && (
          <div className={`p-2 rounded-lg ${style.bg}`}>
            <Icon className={`h-5 w-5 ${style.text}`} />
          </div>
        )}
      </div>

      {/* Value */}
      <div
        className={`${lusitana.className}
          mt-4 text-3xl font-semibold text-gray-800`}
      >
        {value}
      </div>
    </div>
  );
}