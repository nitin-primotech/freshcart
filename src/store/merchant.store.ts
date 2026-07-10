import { create } from 'zustand';

import { isFirebaseConfigured } from '@/lib/firebase/client';
import { subscribeToMerchant } from '@/lib/firebase/merchant.service';

type MerchantState = {
  ready: boolean;
  isOnline: boolean;
  name: string;
};

const initialState: MerchantState = {
  ready: false,
  isOnline: true,
  name: 'FoodRush Kitchen',
};

export const useMerchantStore = create<MerchantState>(() => initialState);

let merchantUnsubscribe: (() => void) | null = null;

export function startMerchantSync(): void {
  if (!isFirebaseConfigured()) {
    useMerchantStore.setState({ ready: true, isOnline: true });
    return;
  }

  if (merchantUnsubscribe) {
    return;
  }

  merchantUnsubscribe = subscribeToMerchant((merchant) => {
    useMerchantStore.setState({
      ready: true,
      isOnline: merchant.status === 'online',
      name: merchant.name,
    });
  });
}

export function stopMerchantSync(): void {
  merchantUnsubscribe?.();
  merchantUnsubscribe = null;
}

export const selectMerchantReady = (state: MerchantState) => state.ready;
export const selectMerchantIsOnline = (state: MerchantState) => state.isOnline;
export const selectMerchantName = (state: MerchantState) => state.name;
