BEGIN;
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS downsell_variant TEXT CHECK (downsell_variant IN ('A','B')),
  ADD COLUMN IF NOT EXISTS pending_cancellation BOOLEAN NOT NULL DEFAULT FALSE;
COMMIT;
