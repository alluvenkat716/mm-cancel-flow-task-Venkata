export type Variant = 'A' | 'B';
export type ReasonOption = 'too_expensive' | 'not_using' | 'technical_issues' | 'other';

export interface CancelState {
  variant: Variant;
  reason?: ReasonOption | 'other';
  reasonText?: string;
  acceptedDownsell?: boolean;
}
