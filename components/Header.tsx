'use client';

import { motion } from 'framer-motion';
import { Plus, Tv, Eye, Clock, CalendarCheck } from 'lucide-react';

interface Props {
  stats: {
    total: number;
    watched: number;
    watching: number;
    planToWatch: number;
  };
  onAddClick: () => void;
}

const statItems = [
  { key: 'total', label: '総数', icon: Tv, color: 'text-white/60' },
  { key: 'watched', label: '視聴済み', icon: CalendarCheck, color: 'text-emerald-400' },
  { key: 'watching', label: '視聴中', icon: Eye, color: 'text-cyan-400' },
  { key: 'planToWatch', label: '視聴予定', icon: Clock, color: 'text-pink-400' },
] as const;

export default function Header({ stats, onAddClick }: Props) {
  return (
    <header className="relative z-10 pt-10 pb-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tight glow-text">
              ANIME TRACKER
            </h1>
            <p className="text-white/30 text-sm mt-1 tracking-widest">
              // ラフマニの視聴記録
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm
              bg-gradient-to-r from-neon-pink to-neon-purple text-white
              shadow-lg shadow-neon-pink/25 hover:shadow-neon-pink/40 transition-shadow"
          >
            <Plus className="w-4 h-4" />
            追加
          </motion.button>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {statItems.map(({ key, label, icon: Icon, color }) => (
            <div
              key={key}
              className="glass rounded-xl px-4 py-3 flex items-center gap-3"
            >
              <Icon className={`w-5 h-5 ${color}`} />
              <div>
                <p className="text-xl font-black text-white/90">
                  {stats[key]}
                </p>
                <p className="text-[11px] text-white/30">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </header>
  );
}
