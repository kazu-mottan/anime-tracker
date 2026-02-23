'use client';

import { motion } from 'framer-motion';
import { Plus, Star, Play, Check } from 'lucide-react';
import { JikanAnimeResult, MediaItem } from '@/types';
import StatusBadge from './StatusBadge';

interface Props {
  anime: JikanAnimeResult;
  index: number;
  existingItem?: MediaItem;
  onAdd: (anime: JikanAnimeResult) => void;
  isEditable?: boolean;
}

export default function SeasonalAnimeCard({ anime, index, existingItem, onAdd, isEditable }: Props) {
  const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const title = anime.title_japanese || anime.title;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (index % 25) * 0.03 }}
      className="glass neon-border rounded-xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
    >
      {/* Cover */}
      <div className="relative h-48 overflow-hidden bg-dark-700">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-12 h-12 text-neon-pink/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />

        {/* Type badge */}
        {anime.type && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-dark-900/80 text-white/70 border border-white/10">
              {anime.type}
            </span>
          </div>
        )}

        {/* Score */}
        {anime.score && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded bg-dark-900/80 border border-white/10">
            <Star className="w-3 h-3 text-amber-400" />
            <span className="text-[11px] font-bold text-amber-400">{anime.score}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-sm text-white/90 line-clamp-2 leading-tight min-h-[2.5rem]">
          {title}
        </h3>

        {/* Meta info */}
        <div className="flex items-center gap-2 text-[11px] text-white/40">
          {anime.episodes ? (
            <span>{anime.episodes}話</span>
          ) : (
            <span>放送中</span>
          )}
        </div>

        {/* Action area */}
        <div className="pt-1">
          {existingItem ? (
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <StatusBadge status={existingItem.status} />
            </div>
          ) : isEditable ? (
            <button
              onClick={() => onAdd(anime)}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold
                bg-neon-pink/10 text-neon-pink border border-neon-pink/20
                hover:bg-neon-pink/20 hover:border-neon-pink/40 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              ウォッチリストに追加
            </button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
