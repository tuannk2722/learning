import { motion } from 'motion/react';
import { TrendingUp, Flame, FlameIcon, ClockIcon, CheckCircle2 } from 'lucide-react';

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
  'Day Streak': FlameIcon,
  'Total Study Time': ClockIcon,
  'Sessions Completed': CheckCircle2,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${style.text}`} />
        </div>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>
      <div className="text-4xl mb-1">{value}</div>
      <div className="text-muted-foreground">{title}</div>
    </motion.div>
  );
}