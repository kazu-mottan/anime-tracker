'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, X, Plus, Trophy, Search } from 'lucide-react';
import { MediaItem } from '@/types';
import StatusBadge from './StatusBadge';

interface Props {
  items: MediaItem[];
  isEditable: boolean;
  onReorder: (orderedIds: string[]) => void;
}

export default function FavoriteRanking({ items, isEditable, onReorder }: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addSearch, setAddSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const rankedItems = useMemo(() => {
    return items
      .filter(item => item.favoriteRank != null)
      .sort((a, b) => (a.favoriteRank ?? 0) - (b.favoriteRank ?? 0));
  }, [items]);

  const unrankedItems = useMemo(() => {
    const filtered = items.filter(item => item.favoriteRank == null);
    if (!addSearch) return filtered;
    return filtered.filter(item =>
      item.title.toLowerCase().includes(addSearch.toLowerCase())
    );
  }, [items, addSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isAddOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsAddOpen(false);
        setAddSearch('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isAddOpen]);

  const orderedIds = rankedItems.map(item => item.id);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newIds = [...orderedIds];
    [newIds[index - 1], newIds[index]] = [newIds[index], newIds[index - 1]];
    onReorder(newIds);
  };

  const moveDown = (index: number) => {
    if (index >= orderedIds.length - 1) return;
    const newIds = [...orderedIds];
    [newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]];
    onReorder(newIds);
  };

  const removeFromRanking = (index: number) => {
    const newIds = orderedIds.filter((_, i) => i !== index);
    onReorder(newIds);
  };

  const addToRanking = (id: string) => {
    const newIds = [...orderedIds, id];
    onReorder(newIds);
    setIsAddOpen(false);
    setAddSearch('');
  };

  const rankColors = [
    'from-yellow-400 to-amber-500',   // 1st - gold
    'from-gray-300 to-gray-400',      // 2nd - silver
    'from-amber-600 to-orange-700',   // 3rd - bronze
  ];

  return (
    <div className="relative z-10 px-4 pt-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold glow-text">お気に入りランキング</h2>
        </div>

        {rankedItems.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="text-white/20 text-lg mb-2">
              ランキングがまだありません
            </p>
            {isEditable && (
              <p className="text-white/10 text-sm">
                下の「+」ボタンからお気に入りを追加しましょう
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {rankedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="glass neon-border rounded-xl overflow-hidden group hover:scale-[1.01] transition-transform duration-300"
                >
                  <div className="flex items-center gap-4 p-3 sm:p-4">
                    {/* Rank number */}
                    <div className="flex-shrink-0 w-10 sm:w-12 text-center">
                      {index < 3 ? (
                        <span className={`text-2xl sm:text-3xl font-black bg-gradient-to-b ${rankColors[index]} bg-clip-text text-transparent drop-shadow-lg`}>
                          {index + 1}
                        </span>
                      ) : (
                        <span className="text-2xl sm:text-3xl font-black text-white/20">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Cover image */}
                    <div className="flex-shrink-0 w-12 h-16 sm:w-14 sm:h-20 rounded-lg overflow-hidden bg-dark-700">
                      {item.coverUrl ? (
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white/20 text-xs">No img</span>
                        </div>
                      )}
                    </div>

                    {/* Title & status */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-white/90 truncate">
                        {item.title}
                      </h3>
                      <div className="mt-1">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>

                    {/* Action buttons */}
                    {isEditable && (
                      <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg text-white/30 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all disabled:opacity-20 disabled:hover:text-white/30 disabled:hover:bg-transparent"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          disabled={index >= rankedItems.length - 1}
                          className="p-1.5 rounded-lg text-white/30 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all disabled:opacity-20 disabled:hover:text-white/30 disabled:hover:bg-transparent"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromRanking(index)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Add to ranking button */}
        {isEditable && (
          <div className="relative mt-6" ref={dropdownRef}>
            <button
              onClick={() => setIsAddOpen(!isAddOpen)}
              className="w-full py-3 rounded-xl text-sm font-bold
                glass border border-dashed border-white/10 text-white/30
                hover:border-neon-pink/30 hover:text-neon-pink transition-all
                flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              ランキングに追加
            </button>

            {/* Dropdown for adding items */}
            <AnimatePresence>
              {isAddOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-0 right-0 mb-2 glass rounded-xl border border-white/10 overflow-hidden shadow-2xl max-h-80 flex flex-col"
                >
                  {/* Search input */}
                  <div className="p-3 border-b border-white/5">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="text"
                        placeholder="タイトルで検索..."
                        value={addSearch}
                        onChange={e => setAddSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-dark-800 border border-white/10 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/30"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Item list */}
                  <div className="overflow-y-auto flex-1">
                    {unrankedItems.length === 0 ? (
                      <p className="text-center text-white/20 text-sm py-6">
                        {addSearch ? '見つかりません' : '追加できる作品がありません'}
                      </p>
                    ) : (
                      unrankedItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => addToRanking(item.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                        >
                          <div className="flex-shrink-0 w-8 h-11 rounded overflow-hidden bg-dark-700">
                            {item.coverUrl ? (
                              <img
                                src={item.coverUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white/10 text-[8px]">No img</span>
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-white/70 truncate">{item.title}</span>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
