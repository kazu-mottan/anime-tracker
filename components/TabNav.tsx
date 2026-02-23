'use client';

import { motion } from 'framer-motion';
import { List, Sparkles, Film } from 'lucide-react';

export type TabType = 'mylist' | 'seasonal-anime' | 'seasonal-movie';

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { key: 'mylist' as const, label: 'マイリスト', icon: List },
  { key: 'seasonal-anime' as const, label: '今季のアニメ', icon: Sparkles },
  { key: 'seasonal-movie' as const, label: '今季のアニメ映画', icon: Film },
];

export default function TabNav({ activeTab, onTabChange }: Props) {
  return (
    <div className="relative z-10 px-4 pt-2">
      <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === key
                ? 'text-white'
                : 'text-white/30 hover:text-white/60'
            }`}
          >
            {activeTab === key && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 glass rounded-xl border border-neon-cyan/30"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
