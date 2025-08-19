'use client';
import { useState } from 'react';

export default function ConfirmStep({
  reason, reasonText, acceptedDownsell, subscriptionId
}: {
  reason?: string;
  reasonText?: string;
  acceptedDownsell: boolean;
  subscriptionId: string;
}) {
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = process.env.NEXT_PUBLIC_MOCK_USER_ID!;

  const submit = async () => {
    setError(null);
    if (!userId || !subscriptionId) { setError('Missing user or subscription id.'); return; }
    setSaving(true);
    try {
      const payload = {
        userId,
        subscriptionId,
        reason: reason === 'other' ? (reasonText ?? '') : (reason ?? ''),
        acceptedDownsell,
      };
      const url = acceptedDownsell ? '/api/apply-discount' : '/api/cancel';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) setError(body?.error || `Failed with ${res.status}`);
      else setDone(true);
    } catch (e: any) {
      setError(e?.message || 'Network error');
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border p-6 text-center">
        <h3 className="text-xl font-semibold">All set</h3>
        <p className="mt-2 opacity-80">
          {acceptedDownsell
            ? 'Your discount is applied and your subscription remains active.'
            : 'Your subscription is now marked for cancellation at the end of this billing period.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold">Confirm</h2>
      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={submit}
          disabled={saving}
          className="rounded-xl bg-black px-5 py-2 text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : acceptedDownsell ? 'Apply discount & stay' : 'Confirm cancel'}
        </button>
      </div>
    </div>
  );
}
