'use client';

import { useState, useEffect, useCallback } from 'react';
import { MediaItem, MediaStatus, MediaType } from '@/types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function useMediaList(token: string | null) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }), [token]);

  // Fetch all items when token is available
  useEffect(() => {
    if (!token) {
      setItems([]);
      setIsLoaded(false);
      return;
    }

    let cancelled = false;

    async function fetchItems() {
      try {
        const res = await fetch('/api/items', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Fetch failed');

        const data: MediaItem[] = await res.json();
        if (!cancelled) {
          setItems(data);
          setIsLoaded(true);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setIsLoaded(true);
        }
      }
    }

    fetchItems();
    return () => { cancelled = true; };
  }, [token]);

  const addItem = useCallback(async (data: {
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

    // Optimistic update
    setItems(prev => [newItem, ...prev]);

    try {
      await fetch('/api/items', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(newItem),
      });
    } catch {
      // Rollback on error
      setItems(prev => prev.filter(item => item.id !== newItem.id));
    }
  }, [authHeaders]);

  const removeItem = useCallback(async (id: string) => {
    setItems(prev => {
      const backup = prev;
      const next = prev.filter(item => item.id !== id);

      fetch(`/api/items/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      }).catch(() => {
        setItems(backup);
      });

      return next;
    });
  }, [authHeaders]);

  const updateStatus = useCallback(async (id: string, status: MediaStatus) => {
    setItems(prev => {
      const backup = prev;
      const next = prev.map(item => (item.id === id ? { ...item, status } : item));

      fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      }).catch(() => {
        setItems(backup);
      });

      return next;
    });
  }, [authHeaders]);

  const stats = {
    total: items.length,
    watched: items.filter(i => i.status === 'watched').length,
    watching: items.filter(i => i.status === 'watching').length,
    planToWatch: items.filter(i => i.status === 'plan-to-watch').length,
  };

  return { items, isLoaded, addItem, removeItem, updateStatus, stats };
}
