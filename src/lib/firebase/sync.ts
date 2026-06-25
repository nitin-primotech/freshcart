import { isFirebaseConfigured } from '@/lib/firebase';
import { startCatalogSync, stopCatalogSync } from '@/store/catalog.store';
import { startMerchantSync, stopMerchantSync } from '@/store/merchant.store';
import { startOrdersSync, stopOrdersSync } from '@/store/orders.store';

export function startFirebaseSync(customerPhone: string | null): void {
  if (!isFirebaseConfigured()) {
    return;
  }

  startCatalogSync();
  startMerchantSync();
  startOrdersSync(customerPhone);
}

export function stopFirebaseSync(): void {
  stopCatalogSync();
  stopMerchantSync();
  stopOrdersSync();
}
