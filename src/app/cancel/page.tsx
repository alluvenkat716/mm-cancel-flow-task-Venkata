'use client';

import { useEffect, useState } from 'react';
import ReasonStep from './steps/Reason';
import DownsellStep from './steps/Downsell';
import ConfirmStep from './steps/Confirm';
import type { CancelState, Variant } from '@/types/cancel';

type Step = 'reason' | 'downsell' | 'confirm';

export default function CancelFlowPage() {
  const [step, setStep] = useState<Step>('reason');
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [alreadyPending, setAlreadyPending] = useState(false);
  const [state, setState] = useState<CancelState>({ variant: 'A' });

  // Fetch subscription id + pending flag on load
  useEffect(() => {
    (async () => {
      const r = await fetch('/api/mock-subscription', { method: 'POST' });
      if (!r.ok) return;
      const d = await r.json();
      setSubscriptionId(d.subscriptionId);
      setAlreadyPending(!!d.pending);
    })();
  }, []);

  // When entering downsell, fetch/lock variant
  useEffect(() => {
    (async () => {
      if (step !== 'downsell' || !subscriptionId) return;
      const userId = process.env.NEXT_PUBLIC_MOCK_USER_ID!;
      const r = await fetch('/api/downsell-variant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subscriptionId }),
      });
      if (!r.ok) return;
      const d = await r.json();
      setState((s) => ({ ...s, variant: d.variant as Variant }));
    })();
  }, [step, subscriptionId]);

  const next = () => setStep((s) => (s === 'reason' ? 'downsell' : 'confirm'));
  const back = () => setStep((s) => (s === 'confirm' ? 'downsell' : 'reason'));

  if (alreadyPending && subscriptionId) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-2xl border p-6 text-center">
          <h1 className="text-xl md:text-2xl font-semibold">Cancellation already scheduled</h1>
          <p className="mt-2 opacity-80">
            Your subscription is already set to end at the close of the current billing period.
            You can come back to resume before that date.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      {step === 'reason' && (
        <ReasonStep
          value={{ reason: state.reason, reasonText: state.reasonText }}
          onChange={(v) => setState((s) => ({ ...s, ...v }))}
          onNext={next}
        />
      )}

      {step === 'downsell' && (
        subscriptionId ? (
          <DownsellStep
            variant={state.variant}
            onBack={back}
            onAccept={() => {
              setState((s) => ({ ...s, acceptedDownsell: true }));
              setStep('confirm');
            }}
            onDecline={() => {
              setState((s) => ({ ...s, acceptedDownsell: false }));
              setStep('confirm');
            }}
          />
        ) : (
          <div className="p-4 text-sm opacity-70">Loading your subscription…</div>
        )
      )}

      {step === 'confirm' && subscriptionId && (
        <ConfirmStep
          reason={state.reason}
          reasonText={state.reasonText}
          acceptedDownsell={!!state.acceptedDownsell}
          subscriptionId={subscriptionId}
        />
      )}
    </div>
  );
}
