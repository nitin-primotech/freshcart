/** Stable instant-delivery estimate in minutes (12–20). */
export function getInstantDeliveryMinutes(itemId: string): number {
  let hash = 0;
  for (const char of itemId) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return 12 + (hash % 9);
}

export function formatInstantDeliveryLabel(minutes: number): string {
  return `${minutes} min`;
}
