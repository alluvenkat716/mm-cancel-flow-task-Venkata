'use client';
import { useState } from 'react';
import type { ReasonOption } from '@/types/cancel';

export default function ReasonStep({
  value, onChange, onNext
}: {
  value: { reason?: ReasonOption | 'other'; reasonText?: string };
  onChange: (v: { reason?: ReasonOption | 'other'; reasonText?: string }) => void;
  onNext: () => void;
}) {
  const [reason, setReason] = useState(value.reason);
  const [reasonText, setReasonText] = useState(value.reasonText ?? '');

  const handleNext = () => {
    if (!reason) return;
    if (reason === 'other' && !reasonText.trim()) return;
    onChange({ reason, reasonText });
    onNext();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl md:text-2xl font-semibold">Why are you canceling?</h1>
      <div className="grid gap-3">
        {([
          ['too_expensive','It’s too expensive'],
          ['not_using','I don’t use it enough'],
          ['technical_issues','I had technical issues'],
          ['other','Other']
        ] as const).map(([key,label]) => (
          <label key={key} className="flex items-center gap-3 rounded-2xl border p-3">
            <input type="radio" name="reason" className="h-4 w-4"
              checked={reason === key} onChange={() => setReason(key as any)} />
            <span>{label}</span>
          </label>
        ))}
      </div>

      {reason === 'other' && (
        <textarea
          className="mt-2 w-full rounded-xl border p-3"
          rows={3}
          placeholder="Tell us a bit more…"
          value={reasonText}
          onChange={(e) => setReasonText(e.target.value)}
        />
      )}

      <div className="flex justify-end">
        <button onClick={handleNext} className="rounded-xl bg-black px-5 py-2 text-white">
          Continue
        </button>
      </div>
    </div>
  );
}
