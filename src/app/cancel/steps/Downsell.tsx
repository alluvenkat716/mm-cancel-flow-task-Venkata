'use client';
import type { Variant } from '@/types/cancel';

export default function DownsellStep({
  variant, onAccept, onDecline, onBack
}: {
  variant: Variant;
  onAccept: () => void;
  onDecline: () => void;
  onBack: () => void;
}) {
  const isB = variant === 'B';
  return (
    <div className="space-y-5">
      <button onClick={onBack} className="text-sm underline">Back</button>
      <div className="rounded-2xl border p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">
          {isB ? 'Save $10 if you stay' : 'Are you sure you want to cancel?'}
        </h2>
        {isB ? (
          <p className="opacity-80">
            Keep your subscription for just <strong>$15</strong> (was $25) on Basic,
            or <strong>$19</strong> (was $29) on Pro.
          </p>
        ) : (
          <p className="opacity-80">You’ll lose access to premium features at the end of your billing period.</p>
        )}
        <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
          <button onClick={onDecline} className="rounded-xl border px-5 py-2">
            {isB ? 'No thanks, cancel' : 'Continue to cancel'}
          </button>
          {isB && (
            <button onClick={onAccept} className="rounded-xl bg-black px-5 py-2 text-white">
              I’ll stay and take the discount
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
