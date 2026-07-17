/** USD display for FreshCart (primary currency). */
export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/** @deprecated Use formatUsd — alias for existing imports */
export const formatInr = formatUsd;

export function deriveMrp(price: number): number {
  return Math.round(price * 1.25 * 100) / 100;
}

export function deriveDiscountPercent(price: number, mrp: number): number {
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}
