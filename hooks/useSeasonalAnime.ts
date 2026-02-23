'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { JikanAnimeResult, JikanSeasonalResponse } from '@/types';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

export type SeasonalFilter = 'tv' | 'movie';

export function useSeasonalAnime(filter: SeasonalFilter) {
  const [results, setResults] = useState<JikanAnimeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pageRef = useRef(1);
  const currentFilterRef = useRef(filter);

  const fetchPage = useCallback(async (pageNum: number, append: boolean, type: SeasonalFilter) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const url = `${JIKAN_BASE_URL}/seasons/now?page=${pageNum}&limit=25&sfw=true&filter=${type}`;
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
        err instanceof Error ? err.message : 'データの取得中にエラーが発生しました。'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (filter !== currentFilterRef.current) {
      currentFilterRef.current = filter;
      pageRef.current = 1;
      setResults([]);
    }
    fetchPage(1, false, filter);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filter, fetchPage]);

  const loadMore = useCallback(() => {
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    fetchPage(nextPage, true, currentFilterRef.current);
  }, [fetchPage]);

  const retry = useCallback(() => {
    pageRef.current = 1;
    fetchPage(1, false, currentFilterRef.current);
  }, [fetchPage]);

  return { results, isLoading, error, hasNextPage, loadMore, retry };
}
