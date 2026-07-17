import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getLocationById } from '@/features/auth/services/location.service';
import type { SavedAddress } from '@/features/auth/types/location.types';
import { SavedAddressCard } from '@/features/location/components/saved-address-card';
import { suggestionFromAddress } from '@/features/location/utils/location-helpers';
import { ProfileSubScreenShell } from '@/features/profile/components/profile-sub-screen-shell';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import {
  selectAddress,
  selectFavoriteLocationIds,
  selectRecentLocationIds,
  setDeliveryAddressFromSuggestion,
  useAppStore,
} from '@/store/app.store';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

export function SavedAddressesScreen() {
  const router = useRouter();
  const address = useAppStore(selectAddress);
  const recentLocationIds = useAppStore(selectRecentLocationIds);
  const favoriteLocationIds = useAppStore(selectFavoriteLocationIds);

  const savedAddresses: SavedAddress[] = [
    {
      id: 'home',
      label: address.label || 'Home',
      isDefault: true,
      suggestion: suggestionFromAddress(address),
    },
    ...recentLocationIds
      .filter((id) => id !== 'home' && id !== 'current-location')
      .map((id) => getLocationById(id))
      .filter((location) => location != null)
      .map((location) => ({
        id: location.id,
        label: location.title,
        isDefault: false,
        suggestion: location,
      })),
  ];

  const uniqueAddresses = savedAddresses.filter(
    (entry, index, list) =>
      list.findIndex((item) => item.id === entry.id) === index,
  );

  function handleSelect(savedAddress: SavedAddress) {
    hapticSoftTap();
    setDeliveryAddressFromSuggestion(savedAddress.suggestion);
    router.back();
  }

  function handleEdit() {
    hapticSoftTap();
    router.push('/location');
  }

  function handleAddNew() {
    hapticSoftTap();
    router.push('/location');
  }

  return (
    <ProfileSubScreenShell
      title="Saved"
      accentTitle="Addresses"
      subtitle="Manage delivery locations"
    >
      <View style={styles.list}>
        {uniqueAddresses.map((savedAddress) => (
          <SavedAddressCard
            key={savedAddress.id}
            address={savedAddress}
            onPress={() => handleSelect(savedAddress)}
            onEdit={handleEdit}
          />
        ))}
      </View>

      <Pressable
        style={styles.addBtn}
        onPress={handleAddNew}
        accessibilityRole="button"
        accessibilityLabel="Add new address"
      >
        <AppSymbol name="plus" size={14} tintColor={colors.primary} />
        <Text style={styles.addBtnText}>Add new address</Text>
      </Pressable>
    </ProfileSubScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: 'rgba(212, 84, 60, 0.25)',
    borderStyle: 'dashed',
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(212, 84, 60, 0.04)',
  },
  addBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.primary,
  },
});
