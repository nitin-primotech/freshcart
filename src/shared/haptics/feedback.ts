import * as ExpoHaptics from 'expo-haptics';
import { TurboModuleRegistry } from 'react-native';

type PulsarModule = typeof import('react-native-pulsar');

const PRELOADED = [
  'snap',
  'peck',
  'chip',
  'fizz',
  'coinDrop',
  'lock',
  'flick',
  'ping',
] as const;

let pulsarModule: PulsarModule | null | undefined;
let preloaded = false;

function isPulsarNativeAvailable(): boolean {
  if (process.env.EXPO_OS === 'web') return false;
  return TurboModuleRegistry?.get?.('RNPulsar') != null;
}

/** Lazy-load Pulsar only when the native TurboModule is linked (dev build). */
function getPulsar(): PulsarModule | null {
  if (pulsarModule !== undefined) return pulsarModule;
  if (!isPulsarNativeAvailable()) {
    pulsarModule = null;
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    pulsarModule = require('react-native-pulsar') as PulsarModule;
    return pulsarModule;
  } catch {
    pulsarModule = null;
    return null;
  }
}

function runExpoFallback(fn: () => Promise<void> | void): void {
  try {
    void fn();
  } catch {
    // Haptics are non-critical; never crash the app.
  }
}

/** Call once at app start for snappier first haptic (Pulsar dev builds only). */
export function preloadAppHaptics(): void {
  if (preloaded) return;
  preloaded = true;
  const pulsar = getPulsar();
  if (pulsar) {
    pulsar.Settings.preloadPresets([...PRELOADED]);
  }
}

/** Light touch on press-in (all interactive surfaces). */
export function hapticPressIn(): void {
  const pulsar = getPulsar();
  if (pulsar) {
    pulsar.Presets.peck();
    return;
  }
  runExpoFallback(() =>
    ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light),
  );
}

/** Primary CTA — Continue, Pay, Verify. */
export function hapticPrimaryAction(): void {
  const pulsar = getPulsar();
  if (pulsar) {
    pulsar.Presets.snap();
    return;
  }
  runExpoFallback(() =>
    ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium),
  );
}

/** Secondary / outline actions. */
export function hapticSecondaryAction(): void {
  const pulsar = getPulsar();
  if (pulsar) {
    pulsar.Presets.chip();
    return;
  }
  runExpoFallback(() =>
    ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light),
  );
}

/** Filters, chips, list picks. */
export function hapticSelection(): void {
  const pulsar = getPulsar();
  if (pulsar) {
    pulsar.Presets.flick();
    return;
  }
  runExpoFallback(() => ExpoHaptics.selectionAsync());
}

/** Add to cart, quantity steppers. */
export function hapticAddToCart(): void {
  const pulsar = getPulsar();
  if (pulsar) {
    pulsar.Presets.coinDrop();
    return;
  }
  runExpoFallback(() =>
    ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success),
  );
}

/** Add to wishlist. */
export function hapticWishlistSave(): void {
  const pulsar = getPulsar();
  if (pulsar) {
    pulsar.Presets.chip();
    return;
  }
  runExpoFallback(() =>
    ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success),
  );
}

/** Open cart sheet / view cart bar. */
export function hapticCartOpen(): void {
  const pulsar = getPulsar();
  if (pulsar) {
    pulsar.Presets.lock();
    return;
  }
  runExpoFallback(() =>
    ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium),
  );
}

/** Checkout complete, order placed. */
export function hapticSuccess(): void {
  const pulsar = getPulsar();
  if (pulsar) {
    pulsar.Presets.fizz();
    return;
  }
  runExpoFallback(() =>
    ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success),
  );
}

/** Tab switches, minor toggles. */
export function hapticSoftTap(): void {
  const pulsar = getPulsar();
  if (pulsar) {
    pulsar.Presets.System.selection();
    return;
  }
  runExpoFallback(() => ExpoHaptics.selectionAsync());
}

/** Whether the full Pulsar preset library is available (native dev build). */
export function isPulsarEnabled(): boolean {
  return getPulsar() != null;
}
