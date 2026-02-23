'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, X } from 'lucide-react';

interface Props {
  onLogin: (password: string) => Promise<{ ok: boolean; error?: string }>;
  onClose?: () => void;
}

export default function PasswordModal({ onLogin, onClose }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim() || isLoading) return;

    setIsLoading(true);
    setError('');

    const result = await onLogin(password);
    if (!result.ok) {
      setError(result.error || '認証に失敗しました');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="glass rounded-2xl border border-white/10 p-8 space-y-6 relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full glass border border-neon-cyan/30 mb-2">
              <Lock className="w-6 h-6 text-neon-cyan" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              ラフマニのアニメ帳
            </h1>
            <p className="text-white/30 text-sm">
              パスワードを入力してください
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                autoFocus
                className="w-full px-4 py-3 rounded-xl glass border border-white/10
                  text-white placeholder-white/20 text-sm
                  focus:border-neon-cyan/40 focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all
                bg-gradient-to-r from-neon-pink to-neon-purple text-white
                hover:shadow-lg hover:shadow-neon-pink/20
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  認証中...
                </span>
              ) : (
                'ログイン'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
