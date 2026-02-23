'use client';

import { useState, useEffect, useCallback } from 'react';
import { MediaItem, MediaStatus, MediaType } from '@/types';

const STORAGE_KEY = 'anime-tracker-list';

const DEFAULT_ITEMS: MediaItem[] = [
  {
    id: 'mushoku-tensei',
    title: '無職転生 〜異世界行ったら本気だす〜',
    type: 'anime',
    status: 'watching',
    note: '転生ファンタジーの最高傑作',
    addedAt: new Date().toISOString(),
  },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function useMediaList() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        setItems(DEFAULT_ITEMS);
      }
    } catch {
      // ignore parse errors
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((data: {
    title: string;
    type: MediaType;
    status: MediaStatus;
    coverUrl?: string;
    synopsis?: string;
    note?: string;
    malId?: number;
  }) => {
    const newItem: MediaItem = {
      id: generateId(),
      ...data,
      addedAt: new Date().toISOString(),
    };
    setItems(prev => [newItem, ...prev]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateStatus = useCallback((id: string, status: MediaStatus) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, status } : item))
    );
  }, []);

  const stats = {
    total: items.length,
    watched: items.filter(i => i.status === 'watched').length,
    watching: items.filter(i => i.status === 'watching').length,
    planToWatch: items.filter(i => i.status === 'plan-to-watch').length,
  };

  return { items, isLoaded, addItem, removeItem, updateStatus, stats };
}
