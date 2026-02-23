'use client';

import { Search } from 'lucide-react';
import { MediaStatus, MediaType } from '@/types';

type StatusFilter = MediaStatus | 'all';
type TypeFilter = MediaType | 'all';

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (v: StatusFilter) => void;
  typeFilter: TypeFilter;
  onTypeFilterChange: (v: TypeFilter) => void;
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'ALL' },
  { value: 'watched', label: '視聴済み' },
  { value: 'watching', label: '視聴中' },
  { value: 'plan-to-watch', label: '視聴予定' },
];

const typeOptions: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'anime', label: 'アニメ' },
  { value: 'movie', label: '映画' },
];

export default function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
}: Props) {
  return (
    <div className="relative z-10 px-4 pb-4">
      <div className="max-w-6xl mx-auto space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="タイトルで検索..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-dark-700 border border-white/5
              text-white/90 placeholder:text-white/20 glow-input transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Status filter */}
          <div className="flex gap-1 p-1 rounded-lg bg-dark-700 border border-white/5">
            {statusOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onStatusFilterChange(value)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  statusFilter === value
                    ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30'
                    : 'text-white/40 hover:text-white/70 border border-transparent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="flex gap-1 p-1 rounded-lg bg-dark-700 border border-white/5">
            {typeOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onTypeFilterChange(value)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  typeFilter === value
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                    : 'text-white/40 hover:text-white/70 border border-transparent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
