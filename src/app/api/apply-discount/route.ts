import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (!origin?.startsWith(process.env.NEXT_PUBLIC_APP_URL!)) {
    return NextResponse.json({ error: 'Bad origin' }, { status: 403 });
  }

  const { userId, subscriptionId } = await req.json();
  if (typeof userId !== 'string' || typeof subscriptionId !== 'string') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const sb = await getSupabaseAdmin();

  const { data: sub, error } = await sb
    .from('subscriptions')
    .select('monthly_price')
    .eq('id', subscriptionId)
    .eq('user_id', userId)
    .single();
  if (error || !sub) {
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
  }

  const p = sub.monthly_price ?? 0;
  const newPrice = p === 2500 ? 1500 : p === 2900 ? 1900 : Math.max(0, p - 1000);

  const { error: updErr } = await sb
    .from('subscriptions')
    .update({ monthly_price: newPrice, pending_cancellation: false })
    .eq('id', subscriptionId)
    .eq('user_id', userId);
  if (updErr) {
    return NextResponse.json({ error: 'Unable to apply discount' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, newPrice });
}
