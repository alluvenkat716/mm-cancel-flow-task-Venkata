// src/lib/supabase.ts
// Supabase client configuration for database connections
// Does not include authentication setup or advanced features

import { createClient } from '@supabase/supabase-js';

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const PUBLIC_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(PUBLIC_URL, PUBLIC_ANON, {
  auth: { persistSession: true },
});

export async function getSupabaseAdmin() {
  if (typeof window !== 'undefined') throw new Error('server only');
  const { createClient: createAdminClient } = await import('@supabase/supabase-js');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceKey) throw new Error('missing env');
  return createAdminClient(url, serviceKey, { auth: { persistSession: false } });
}
