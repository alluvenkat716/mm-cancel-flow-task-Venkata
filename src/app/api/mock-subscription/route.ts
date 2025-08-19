import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  return NextResponse.json({ ok: true, route: '/api/mock-subscription' });
}

export async function POST() {
  const userId = process.env.MOCK_USER_ID!;
  const sb = await getSupabaseAdmin();

  const { data, error } = await sb
    .from('subscriptions')
    .select('id, pending_cancellation, status')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: 'No subscription' }, { status: 404 });
  }

  return NextResponse.json({
    userId,
    subscriptionId: data.id,
    pending: !!data.pending_cancellation,
    status: data.status,
  });
}
