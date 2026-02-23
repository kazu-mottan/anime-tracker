import { NextRequest } from 'next/server';

const tokens = new Set<string>();

export function generateToken(): string {
  const token = crypto.randomUUID();
  tokens.add(token);
  return token;
}

export function validateToken(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return false;
  return tokens.has(auth.slice(7));
}
