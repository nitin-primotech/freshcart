import { isFirebaseConfigured } from '@/lib/firebase';
import { startCatalogSync, stopCatalogSync } from '@/store/catalog.store';
import { startOrdersSync, stopOrdersSync } from '@/store/orders.store';

export function startFirebaseSync(customerPhone: string | null): void {
  if (!isFirebaseConfigured()) {
    return;
  }

  startCatalogSync();
  startOrdersSync(customerPhone);
}

export function stopFirebaseSync(): void {
  stopCatalogSync();
  stopOrdersSync();
}
