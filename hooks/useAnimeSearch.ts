'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { JikanAnimeResult, JikanSearchResponse } from '@/types';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const DEBOUNCE_MS = 500;
const MIN_QUERY_LENGTH = 2;

export function useAnimeSearch() {
  const [results, setResults] = useState<JikanAnimeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  const search = useCallback((query: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length < MIN_QUERY_LENGTH) {
      clearResults();
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    debounceTimerRef.current = setTimeout(async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const url = `${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query.trim())}&limit=6&sfw=true`;
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('APIリクエスト制限に達しました。少し待ってから再度お試しください。');
          }
          throw new Error(`API error: ${response.status}`);
        }

        const data: JikanSearchResponse = await response.json();
        setResults(data.data);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError(
          err instanceof Error ? err.message : '検索中にエラーが発生しました。'
        );
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);
  }, [clearResults]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { results, isLoading, error, search, clearResults };
}
