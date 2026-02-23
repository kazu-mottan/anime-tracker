'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Tv, Film, ChevronRight } from 'lucide-react';
import { MediaItem, MediaStatus } from '@/types';
import StatusBadge from './StatusBadge';

const nextStatus: Record<MediaStatus, MediaStatus> = {
  'plan-to-watch': 'watching',
  watching: 'watched',
  watched: 'plan-to-watch',
};

const nextStatusLabel: Record<MediaStatus, string> = {
  'plan-to-watch': '視聴中へ',
  watching: '視聴済みへ',
  watched: '予定へ戻す',
};

interface Props {
  item: MediaItem;
  index: number;
  onUpdateStatus: (id: string, status: MediaStatus) => void;
  onRemove: (id: string) => void;
}

export default function AnimeCard({ item, index, onUpdateStatus, onRemove }: Props) {
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="glass neon-border rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
    >
      {/* Cover area */}
      <div className="relative h-40 overflow-hidden bg-dark-700">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative">
              {item.type === 'anime' ? (
                <Tv className="w-12 h-12 text-neon-pink/40" />
              ) : (
                <Film className="w-12 h-12 text-neon-cyan/40" />
              )}
              <div className="absolute inset-0 blur-xl bg-neon-pink/10 rounded-full" />
            </div>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-dark-900/80 text-white/70 border border-white/10">
            {item.type === 'anime' ? 'ANIME' : 'ANIME MOVIE'}
          </span>
        </div>

        {/* Delete button */}
        <button
          onClick={() => onRemove(item.id)}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-dark-900/80 text-white/40 hover:text-red-400 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-sm text-white/90 line-clamp-2 leading-tight">
          {item.title}
        </h3>

        {item.synopsis && (
          <div>
            <p
              className={`text-xs text-white/50 leading-relaxed ${
                isSynopsisExpanded ? '' : 'line-clamp-2'
              }`}
            >
              {item.synopsis}
            </p>
            {item.synopsis.length > 80 && (
              <button
                onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
                className="text-[10px] text-neon-cyan/60 hover:text-neon-cyan transition-colors mt-0.5"
              >
                {isSynopsisExpanded ? '閉じる' : '続きを読む'}
              </button>
            )}
          </div>
        )}

        {item.note && (
          <p className="text-xs text-white/40 line-clamp-1">{item.note}</p>
        )}

        <div className="flex items-center justify-between pt-1">
          <StatusBadge status={item.status} />
          <button
            onClick={() => onUpdateStatus(item.id, nextStatus[item.status])}
            className="flex items-center gap-1 text-[11px] text-white/30 hover:text-neon-cyan transition-colors"
          >
            {nextStatusLabel[item.status]}
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
