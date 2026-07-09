import { Clock, CheckCircle2 } from 'lucide-react';
import type { PostStatus } from '../../types';

interface StatusBadgeProps {
  status: PostStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const cls = size === 'sm' ? 'text-[10px] px-1.5 py-0.5 gap-0.5' : 'text-xs px-2.5 py-1 gap-1';
  const iconSize = size === 'sm' ? 9 : 11;

  if (status === 'scheduled') {
    return (
      <span className={`inline-flex items-center ${cls} rounded-full bg-amber-100 text-amber-700 font-semibold`}>
        <Clock size={iconSize} />
        予約中
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center ${cls} rounded-full bg-emerald-100 text-emerald-700 font-semibold`}>
      <CheckCircle2 size={iconSize} />
      投稿済
    </span>
  );
}
