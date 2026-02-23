import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { validateToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await getSupabase()
    .from('media_items')
    .select('*')
    .order('added_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Convert snake_case DB columns to camelCase for frontend
  const items = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    type: row.type,
    status: row.status,
    coverUrl: row.cover_url,
    synopsis: row.synopsis,
    note: row.note,
    malId: row.mal_id,
    addedAt: row.added_at,
  }));

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  if (!validateToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const row = {
      id: body.id,
      title: body.title,
      type: body.type,
      status: body.status,
      cover_url: body.coverUrl ?? null,
      synopsis: body.synopsis ?? null,
      note: body.note ?? null,
      mal_id: body.malId ?? null,
      added_at: body.addedAt,
    };

    const { data, error } = await getSupabase()
      .from('media_items')
      .insert(row)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      type: data.type,
      status: data.status,
      coverUrl: data.cover_url,
      synopsis: data.synopsis,
      note: data.note,
      malId: data.mal_id,
      addedAt: data.added_at,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
