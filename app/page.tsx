'use client';

import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useMediaList } from '@/hooks/useMediaList';
import { useSeasonalAnime, SeasonalFilter } from '@/hooks/useSeasonalAnime';
import { MediaStatus, MediaType, JikanAnimeResult } from '@/types';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import AnimeCard from '@/components/AnimeCard';
import AddModal from '@/components/AddModal';
import TabNav, { TabType } from '@/components/TabNav';
import SeasonalAnimeCard from '@/components/SeasonalAnimeCard';

type StatusFilter = MediaStatus | 'all';
type TypeFilter = MediaType | 'all';

const tabToFilter: Record<string, SeasonalFilter> = {
  'seasonal-anime': 'tv',
  'seasonal-movie': 'movie',
};

export default function Home() {
  const { items, isLoaded, addItem, removeItem, updateStatus, stats } = useMediaList();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [activeTab, setActiveTab] = useState<TabType>('mylist');

  const seasonalFilter: SeasonalFilter = tabToFilter[activeTab] ?? 'tv';
  const { results: seasonalAnime, isLoading: isSeasonalLoading, error: seasonalError, hasNextPage, loadMore, retry } = useSeasonalAnime(seasonalFilter);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (search && !item.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }
      return true;
    });
  }, [items, search, statusFilter, typeFilter]);

  // Map of malId -> MediaItem for quick lookup
  const malIdMap = useMemo(() => {
    const map = new Map<number, typeof items[0]>();
    for (const item of items) {
      if (item.malId) {
        map.set(item.malId, item);
      }
    }
    return map;
  }, [items]);

  const handleAddFromSeasonal = useCallback((anime: JikanAnimeResult) => {
    if (malIdMap.has(anime.mal_id)) return;
    const isMovie = anime.type === 'Movie';
    addItem({
      title: anime.title_japanese || anime.title,
      type: isMovie ? 'movie' : 'anime',
      status: 'watching',
      coverUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
      synopsis: anime.synopsis || undefined,
      malId: anime.mal_id,
    });
  }, [addItem, malIdMap]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neon-pink animate-pulse text-lg font-bold tracking-widest">
          LOADING...
        </div>
      </div>
    );
  }

  const isSeasonal = activeTab === 'seasonal-anime' || activeTab === 'seasonal-movie';

  return (
    <main className="relative min-h-screen pb-12">
      <Header stats={stats} onAddClick={() => setIsModalOpen(true)} />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      {!isSeasonal ? (
        <>
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
          />

          {/* Card Grid */}
          <div className="relative z-10 px-4 pt-4">
            <div className="max-w-6xl mx-auto">
              {filteredItems.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-white/20 text-lg mb-2">
                    {items.length === 0 ? '作品がまだありません' : '条件に一致する作品がありません'}
                  </p>
                  {items.length === 0 && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="text-neon-pink/60 hover:text-neon-pink text-sm transition-colors"
                    >
                      + 最初の作品を追加しましょう
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, index) => (
                      <AnimeCard
                        key={item.id}
                        item={item}
                        index={index}
                        onUpdateStatus={updateStatus}
                        onRemove={removeItem}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Seasonal Tab */
        <div className="relative z-10 px-4 pt-6">
          <div className="max-w-6xl mx-auto">
            {seasonalError && (
              <div className="text-center py-10 space-y-3">
                <p className="text-red-400 text-sm">{seasonalError}</p>
                <button
                  onClick={retry}
                  className="px-4 py-2 rounded-lg text-xs font-bold
                    glass border border-white/10 text-white/50
                    hover:border-neon-cyan/30 hover:text-neon-cyan transition-all"
                >
                  再試行
                </button>
              </div>
            )}

            {seasonalAnime.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {seasonalAnime.map((anime, index) => (
                  <SeasonalAnimeCard
                    key={anime.mal_id}
                    anime={anime}
                    index={index}
                    existingItem={malIdMap.get(anime.mal_id)}
                    onAdd={handleAddFromSeasonal}
                  />
                ))}
              </div>
            )}

            {/* Load more / Loading */}
            <div className="text-center py-8">
              {isSeasonalLoading ? (
                <div className="flex items-center justify-center gap-2 text-white/40">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">読み込み中...</span>
                </div>
              ) : hasNextPage ? (
                <button
                  onClick={loadMore}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold
                    glass border border-neon-cyan/20 text-neon-cyan/70
                    hover:border-neon-cyan/40 hover:text-neon-cyan transition-all"
                >
                  もっと読み込む
                </button>
              ) : seasonalAnime.length > 0 ? (
                <p className="text-white/20 text-xs">すべて表示しました</p>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-10 text-center pt-12 pb-6">
        <p className="text-white/10 text-xs tracking-widest">
          ANIME TRACKER v1.0
        </p>
      </div>

      <AddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addItem}
      />
    </main>
  );
}
