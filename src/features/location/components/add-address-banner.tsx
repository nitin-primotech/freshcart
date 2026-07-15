import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { GROCERY_ADDRESS } from '@/constants/brand-assets';
import { PremiumText } from '@/shared/components/premium-text';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts, typography } from '@/theme/typography';

type AddAddressBannerProps = {
  onPress: () => void;
};

export function AddAddressBanner({ onPress }: AddAddressBannerProps) {
  return (
    <View style={styles.banner}>
      <Image
        source={GROCERY_ADDRESS}
        style={styles.illustration}
        contentFit="contain"
        accessibilityLabel="Grocery bag illustration"
      />

      <View style={styles.content}>
        <PremiumText style={styles.title}>
          Deliver to a different address?
        </PremiumText>
        <PremiumText style={styles.subtitle}>
          Add a new address to get started.
        </PremiumText>

        <Pressable
          style={styles.button}
          onPress={() => {
            hapticSoftTap();
            onPress();
          }}
          accessibilityRole="button"
          accessibilityLabel="Add new address"
        >
          <PremiumText style={styles.buttonText}>Add New Address</PremiumText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  illustration: {
    width: 64,
    height: 64,
    marginTop: 2,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.bodySmall,
    fontFamily: fonts.semibold,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.xxs,
  },
  buttonText: {
    ...typography.captionMedium,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
});
