
# Cancel Flow (take-home)

I built a small subscription **cancellation flow** with a deterministic A/B downsell using **Next.js + TypeScript + Tailwind + Supabase**. This is evaluation-only (not production).

## Quickstart

```bash
npm install
npm run db:setup
npm run dev
# open http://localhost:3000/cancel
````

## Environment

Create `.env.local` using the keys printed by `npx supabase start` (an example is in `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=REPLACE_ME
SUPABASE_SERVICE_ROLE_KEY=REPLACE_ME
NEXT_PUBLIC_APP_URL=http://localhost:3000
MOCK_USER_ID=550e8400-e29b-41d4-a716-446655440001
NEXT_PUBLIC_MOCK_USER_ID=550e8400-e29b-41d4-a716-446655440001
```

`npm run db:setup` starts Supabase and applies `seed.sql` + `schema_patch.sql`.

## What I implemented

* Progressive flow: **Reason → Offer (A/B) → Confirm** with mobile/desktop layouts.
* Deterministic A/B: assigned once with secure RNG, stored in `subscriptions.downsell_variant`, reused on return.
* Cancel path: sets `subscriptions.pending_cancellation = true` and inserts into `cancellations`.
* Discount path (if Variant B accepted): reduces price (\$25→\$15 or \$29→\$19) and keeps the subscription active (no cancellation row).
* “Already pending” UX: shows an info card if the sub is already pending.
* Security: Origin check (CSRF), payload validation (incl. max reason length), RLS policies added.

## Where things are

```
src/app/cancel/page.tsx
src/app/cancel/steps/{Reason,Downsell,Confirm}.tsx
src/app/api/{mock-subscription,downsell-variant,cancel,apply-discount}/route.ts
src/lib/supabase.ts
src/types/cancel.ts
seed.sql
schema_patch.sql
```

## How I test manually

1. Open `/cancel`, pick a reason → **Continue**.
2. Variant A (no discount): continue → confirm cancel → success card.
3. Variant B: **I’ll stay and take the discount** → **Apply discount & stay** → success card.
4. DB checks (optional):

   * `pending_cancellation` toggles correctly
   * `monthly_price` drops on discount
   * `cancellations` row only when actually canceling

## Troubleshooting

* **405 on /api/**: route files must be `route.ts` with `export async function POST`.
* **“Conflicting route and page at /cancel”**: remove any `src/app/cancel/route.*`.
* **403 Bad origin**: use `http://localhost:3000` and set `NEXT_PUBLIC_APP_URL` to that.
* **Variant missing / columns missing**: run `npm run db:setup`.

````

If you want me to save it for you via a command, run:

```bash
cat > README.md <<'MD'
# Cancel Flow (take-home)

I built a small subscription **cancellation flow** with a deterministic A/B downsell using **Next.js + TypeScript + Tailwind + Supabase**. This is evaluation-only (not production).

## Quickstart

```bash
npm install
npm run db:setup
npm run dev
# open http://localhost:3000/cancel
````

## Environment

Create `.env.local` using the keys printed by `npx supabase start` (an example is in `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=REPLACE_ME
SUPABASE_SERVICE_ROLE_KEY=REPLACE_ME
NEXT_PUBLIC_APP_URL=http://localhost:3000
MOCK_USER_ID=550e8400-e29b-41d4-a716-446655440001
NEXT_PUBLIC_MOCK_USER_ID=550e8400-e29b-41d4-a716-446655440001
```

`npm run db:setup` starts Supabase and applies `seed.sql` + `schema_patch.sql`.

## What I implemented

* Progressive flow: **Reason → Offer (A/B) → Confirm** with mobile/desktop layouts.
* Deterministic A/B: assigned once with secure RNG, stored in `subscriptions.downsell_variant`, reused on return.
* Cancel path: sets `subscriptions.pending_cancellation = true` and inserts into `cancellations`.
* Discount path (if Variant B accepted): reduces price (\$25→\$15 or \$29→\$19) and keeps the subscription active (no cancellation row).
* “Already pending” UX: shows an info card if the sub is already pending.
* Security: Origin check (CSRF), payload validation (incl. max reason length), RLS policies added.

## Where things are

```
src/app/cancel/page.tsx
src/app/cancel/steps/{Reason,Downsell,Confirm}.tsx
src/app/api/{mock-subscription,downsell-variant,cancel,apply-discount}/route.ts
src/lib/supabase.ts
src/types/cancel.ts
seed.sql
schema_patch.sql
```

## How I test manually

1. Open `/cancel`, pick a reason → **Continue**.
2. Variant A (no discount): continue → confirm cancel → success card.
3. Variant B: **I’ll stay and take the discount** → **Apply discount & stay** → success card.
4. DB checks (optional):

   * `pending_cancellation` toggles correctly
   * `monthly_price` drops on discount
   * `cancellations` row only when actually canceling

## Troubleshooting

* **405 on /api/**: route files must be `route.ts` with `export async function POST`.
* **“Conflicting route and page at /cancel”**: remove any `src/app/cancel/route.*`.
* **403 Bad origin**: use `http://localhost:3000` and set `NEXT_PUBLIC_APP_URL` to that.
* **Variant missing / columns missing**: run `npm run db:setup`.
  MD


