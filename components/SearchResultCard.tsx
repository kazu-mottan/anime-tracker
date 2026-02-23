'use client';

import { motion } from 'framer-motion';
import { Star, Play } from 'lucide-react';
import { JikanAnimeResult } from '@/types';

interface Props {
  result: JikanAnimeResult;
  onSelect: (result: JikanAnimeResult) => void;
}

export default function SearchResultCard({ result, onSelect }: Props) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onClick={() => onSelect(result)}
      className="w-full flex items-start gap-3 p-2 rounded-lg
        bg-dark-700/50 border border-white/5
        hover:border-neon-cyan/30 hover:bg-dark-700
        transition-all text-left group"
    >
      <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-dark-800">
        {result.images?.jpg?.image_url ? (
          <img
            src={result.images.jpg.image_url}
            alt={result.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-4 h-4 text-white/20" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-white/90 line-clamp-1 group-hover:text-neon-cyan transition-colors">
          {result.title_japanese || result.title}
        </p>
        <p className="text-[10px] text-white/40 line-clamp-1 mt-0.5">
          {result.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {result.type && (
            <span className="text-[10px] text-white/30 px-1.5 py-0.5 rounded bg-white/5">
              {result.type}
            </span>
          )}
          {result.episodes && (
            <span className="text-[10px] text-white/30">
              {result.episodes}話
            </span>
          )}
          {result.score && (
            <span className="flex items-center gap-0.5 text-[10px] text-amber-400/70">
              <Star className="w-2.5 h-2.5" />
              {result.score}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
