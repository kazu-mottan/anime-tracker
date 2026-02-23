'use client';

import { MediaStatus } from '@/types';

const statusConfig: Record<MediaStatus, { label: string; color: string; bg: string }> = {
  watched: {
    label: '視聴済み',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15 border-emerald-500/30',
  },
  watching: {
    label: '視聴中',
    color: 'text-neon-cyan',
    bg: 'bg-cyan-500/15 border-cyan-500/30',
  },
  'plan-to-watch': {
    label: '視聴予定',
    color: 'text-neon-pink',
    bg: 'bg-pink-500/15 border-pink-500/30',
  },
};

export default function StatusBadge({ status }: { status: MediaStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {config.label}
    </span>
  );
}
