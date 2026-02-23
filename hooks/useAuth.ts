'use client';

import { useState, useEffect, useCallback } from 'react';

const TOKEN_KEY = 'anime-tracker-token';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
    }
    setIsChecking(false);
  }, []);

  const login = useCallback(async (password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false, error: data.error || '認証に失敗しました' };
      }

      sessionStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      return { ok: true };
    } catch {
      return { ok: false, error: 'サーバーに接続できません' };
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  return {
    token,
    isAuthenticated: !!token,
    isChecking,
    login,
    logout,
  };
}
