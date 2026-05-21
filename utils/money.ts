export function formatINR(value: number, options?: { maximumFractionDigits?: number }): string {
  const maximumFractionDigits = options?.maximumFractionDigits ?? 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits,
  }).format(value);
}

export function formatINR2(value: number): string {
  return formatINR(value, { maximumFractionDigits: 2 });
}

export function formatINRCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
  if (abs >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  if (abs >= 1000) return `₹${(value / 1000).toFixed(1)} K`;
  return formatINR2(value);
}

