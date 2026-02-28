import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { validateToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  if (!validateToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { rankings } = await request.json();

    if (!Array.isArray(rankings)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    const supabase = getSupabase();

    // Clear all existing ranks to avoid unique constraint conflicts
    await supabase
      .from('media_items')
      .update({ favorite_rank: null })
      .not('favorite_rank', 'is', null);

    // Set new ranks
    for (const { id, favoriteRank } of rankings) {
      if (favoriteRank != null) {
        await supabase
          .from('media_items')
          .update({ favorite_rank: favoriteRank })
          .eq('id', id);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
