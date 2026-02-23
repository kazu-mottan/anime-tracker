'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { JikanAnimeResult, JikanSeasonalResponse } from '@/types';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

export function useSeasonalAnime() {
  const [results, setResults] = useState<JikanAnimeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchedRef = useRef(false);
  const pageRef = useRef(1);

  const fetchPage = useCallback(async (pageNum: number, append: boolean) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const url = `${JIKAN_BASE_URL}/seasons/now?page=${pageNum}&limit=25&sfw=true`;
      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('APIリクエスト制限に達しました。少し待ってから再度お試しください。');
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data: JikanSeasonalResponse = await response.json();
      const items = Array.isArray(data?.data) ? data.data : [];
      setResults(prev => append ? [...prev, ...items] : items);
      setHasNextPage(data?.pagination?.has_next_page ?? false);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      setError(
        err instanceof Error ? err.message : '今季アニメの取得中にエラーが発生しました。'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchPage(1, false);
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    fetchPage(nextPage, true);
  }, [fetchPage]);

  const retry = useCallback(() => {
    pageRef.current = 1;
    fetchPage(1, false);
  }, [fetchPage]);

  return { results, isLoading, error, hasNextPage, loadMore, retry };
}
