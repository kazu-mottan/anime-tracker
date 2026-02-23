'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tv, Film, Search, Loader2 } from 'lucide-react';
import { MediaStatus, MediaType, JikanAnimeResult } from '@/types';
import { useAnimeSearch } from '@/hooks/useAnimeSearch';
import SearchResultCard from './SearchResultCard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    title: string;
    type: MediaType;
    status: MediaStatus;
    coverUrl?: string;
    synopsis?: string;
    note?: string;
    malId?: number;
  }) => void;
}

export default function AddModal({ isOpen, onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MediaType>('anime');
  const [status, setStatus] = useState<MediaStatus>('plan-to-watch');
  const [coverUrl, setCoverUrl] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [note, setNote] = useState('');
  const [malId, setMalId] = useState<number | undefined>(undefined);
  const [showResults, setShowResults] = useState(false);

  const { results, isLoading, error, search, clearResults } = useAnimeSearch();

  const handleSelectResult = (result: JikanAnimeResult) => {
    setTitle(result.title_japanese || result.title);
    setCoverUrl(result.images?.jpg?.large_image_url || result.images?.jpg?.image_url || '');
    setSynopsis(result.synopsis || '');
    setMalId(result.mal_id);
    if (result.type === 'Movie') {
      setType('movie');
    } else {
      setType('anime');
    }
    setShowResults(false);
    clearResults();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      type,
      status,
      coverUrl: coverUrl.trim() || undefined,
      synopsis: synopsis.trim() || undefined,
      note: note.trim() || undefined,
      malId,
    });
    setTitle('');
    setCoverUrl('');
    setSynopsis('');
    setNote('');
    setMalId(undefined);
    clearResults();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md glass rounded-2xl border border-white/10 p-6 max-h-[85vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white/90 mb-5">
              <span className="glow-text">+</span> 作品を追加
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title + API Search */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">タイトル *</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTitle(value);
                      search(value);
                      setShowResults(true);
                      setMalId(undefined);
                    }}
                    onFocus={() => {
                      if (results.length > 0) setShowResults(true);
                    }}
                    placeholder="例: 進撃の巨人（APIから検索されます）"
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-dark-700 border border-white/5
                      text-white/90 placeholder:text-white/20 glow-input transition-all"
                    autoFocus
                  />
                  {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neon-cyan/50 animate-spin" />
                  )}
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showResults && (isLoading || results.length > 0 || error) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 max-h-[240px] overflow-y-auto rounded-lg border border-white/5 bg-dark-800/90 backdrop-blur-sm"
                    >
                      {error && (
                        <p className="text-xs text-red-400/70 px-3 py-2">{error}</p>
                      )}

                      {!isLoading && results.length > 0 && (
                        <div className="p-1.5 space-y-1">
                          {results.map((result) => (
                            <SearchResultCard
                              key={result.mal_id}
                              result={result}
                              onSelect={handleSelectResult}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Selected Preview */}
              {malId && coverUrl && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20"
                >
                  <img src={coverUrl} alt="" className="w-10 h-14 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neon-cyan line-clamp-1">{title}</p>
                    <p className="text-[10px] text-white/30">MALから自動入力されました</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setMalId(undefined); setCoverUrl(''); setSynopsis(''); }}
                    className="text-[10px] text-white/30 hover:text-white/60 transition-colors px-2"
                  >
                    クリア
                  </button>
                </motion.div>
              )}

              {/* Type selector */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">種別</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setType('anime')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      type === 'anime'
                        ? 'bg-neon-pink/15 border-neon-pink/40 text-neon-pink'
                        : 'bg-dark-700 border-white/5 text-white/40 hover:text-white/60'
                    }`}
                  >
                    <Tv className="w-4 h-4" />
                    アニメ
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('movie')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      type === 'movie'
                        ? 'bg-neon-cyan/15 border-neon-cyan/40 text-neon-cyan'
                        : 'bg-dark-700 border-white/5 text-white/40 hover:text-white/60'
                    }`}
                  >
                    <Film className="w-4 h-4" />
                    アニメ映画
                  </button>
                </div>
              </div>

              {/* Status selector */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">ステータス</label>
                <div className="flex gap-1.5">
                  {([
                    { value: 'plan-to-watch' as const, label: '視聴予定' },
                    { value: 'watching' as const, label: '視聴中' },
                    { value: 'watched' as const, label: '視聴済み' },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setStatus(opt.value)}
                      className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        status === opt.value
                          ? 'bg-neon-purple/15 border-neon-purple/40 text-neon-purple'
                          : 'bg-dark-700 border-white/5 text-white/40 hover:text-white/60'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover URL */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">
                  カバー画像URL（任意）
                </label>
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-dark-700 border border-white/5
                    text-white/90 placeholder:text-white/20 glow-input transition-all"
                />
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">あらすじ（任意）</label>
                <textarea
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="作品のあらすじ..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-dark-700 border border-white/5
                    text-white/90 placeholder:text-white/20 glow-input transition-all resize-none"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">メモ（任意）</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="感想など..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-dark-700 border border-white/5
                    text-white/90 placeholder:text-white/20 glow-input transition-all"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!title.trim()}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-all
                  bg-gradient-to-r from-neon-pink to-neon-purple text-white
                  shadow-lg shadow-neon-pink/20 hover:shadow-neon-pink/40
                  disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
              >
                追加する
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
