import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (!origin?.startsWith(process.env.NEXT_PUBLIC_APP_URL!)) {
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { userId, subscriptionId, reason, acceptedDownsell } = body ?? {};
  if (
    typeof userId !== 'string' ||
    typeof subscriptionId !== 'string' ||
    typeof reason !== 'string' ||
    typeof acceptedDownsell !== 'boolean'
  ) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  
  if (reason.length > 500) {
    return NextResponse.json({ error: 'Reason too long' }, { status: 413 });
  }

  const sb = await getSupabaseAdmin();

  const { data: sub, error: subErr } = await sb
    .from('subscriptions')
    .select('downsell_variant')
    .eq('id', subscriptionId)
    .eq('user_id', userId)
    .single();
  if (subErr || !sub?.downsell_variant) {
    return NextResponse.json({ error: 'Variant missing' }, { status: 422 });
  }

  const { error: updErr } = await sb
    .from('subscriptions')
    .update({ pending_cancellation: true })
    .eq('id', subscriptionId)
    .eq('user_id', userId);
  if (updErr) return NextResponse.json({ error: 'Unable to mark pending' }, { status: 500 });

  const { error: insErr } = await sb.from('cancellations').insert({
    user_id: userId,
    subscription_id: subscriptionId,
    downsell_variant: sub.downsell_variant,
    reason,
    accepted_downsell: acceptedDownsell,
  });
  if (insErr) return NextResponse.json({ error: 'Unable to create cancellation' }, { status: 500 });

  return NextResponse.json({ ok: true });
}
