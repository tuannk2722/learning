import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
        <BookOpen className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold">
        GamifiedLearning
      </span>
    </Link>
  );
}
