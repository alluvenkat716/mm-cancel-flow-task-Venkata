import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { randomInt } from 'crypto';

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (!origin?.startsWith(process.env.NEXT_PUBLIC_APP_URL!)) {
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }
  const { userId, subscriptionId } = await req.json();
  const sb = await getSupabaseAdmin();

  const { data: sub, error } = await sb
    .from('subscriptions')
    .select('downsell_variant')
    .eq('id', subscriptionId)
    .eq('user_id', userId)
    .single();
  if (error) return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });

  let variant = sub?.downsell_variant as 'A' | 'B' | null;
  if (!variant) {
    variant = randomInt(0, 2) === 0 ? 'A' : 'B';
    const { error: updErr } = await sb
      .from('subscriptions')
      .update({ downsell_variant: variant })
      .eq('id', subscriptionId)
      .eq('user_id', userId);
    if (updErr) return NextResponse.json({ error: 'Unable to set variant' }, { status: 500 });
  }
  return NextResponse.json({ variant });
}
