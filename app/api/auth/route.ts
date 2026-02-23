import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const appPassword = process.env.APP_PASSWORD;

    if (!appPassword) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (password !== appPassword) {
      return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 });
    }

    const token = generateToken();
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
