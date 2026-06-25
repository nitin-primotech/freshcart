import { StyleSheet, Text, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import {
  selectMerchantIsOnline,
  selectMerchantName,
  selectMerchantReady,
  useMerchantStore,
} from '@/store/merchant.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function MerchantOfflineBanner() {
  const ready = useMerchantStore(selectMerchantReady);
  const isOnline = useMerchantStore(selectMerchantIsOnline);
  const merchantName = useMerchantStore(selectMerchantName);

  if (!ready || isOnline) {
    return null;
  }

  return (
    <View style={styles.banner} accessibilityRole="text">
      <AppSymbol
        name="wifi.exclamationmark"
        size={16}
        tintColor={colors.danger}
      />
      <View style={styles.copy}>
        <Text style={styles.title}>{merchantName} is offline</Text>
        <Text style={styles.subtitle}>
          New orders are paused. You can browse the menu, but checkout is
          temporarily unavailable.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    borderCurve: 'continuous',
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.18)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.danger,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 15,
    color: '#991B1B',
  },
});
