// Currency conversion: assume source numeric values in mock data are USD.
// Use a static FX_RATE to convert USD -> INR for display. Can be overridden
// via Vite env `VITE_FX_RATE` if needed.
const FX_RATE = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_FX_RATE)
  ? Number((import.meta as any).env.VITE_FX_RATE) : 83;

function toINR(value: number): number {
  return value * FX_RATE;
}

export function formatINR(value: number, options?: { maximumFractionDigits?: number }): string {
  const maximumFractionDigits = options?.maximumFractionDigits ?? 0;
  const inr = toINR(value);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits,
  }).format(inr);
}

export function formatINR2(value: number): string {
  return formatINR(value, { maximumFractionDigits: 2 });
}

export function formatINRCompact(value: number): string {
  // Convert first, then apply compact units for Indian numbering (K, L, Cr)
  const inr = toINR(value);
  const abs = Math.abs(inr);
  if (abs >= 10000000) return `${(inr / 10000000).toFixed(1)} Cr`;
  if (abs >= 100000) return `${(inr / 100000).toFixed(1)} L`;
  if (abs >= 1000) return `${(inr / 1000).toFixed(1)} K`;
  return formatINR2(value);
}

