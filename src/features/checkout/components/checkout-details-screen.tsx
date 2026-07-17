import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type View as ViewType,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DEFAULT_PROFILE } from '@/features/auth/services/profile-storage';
import {
  formatDeliveryLine2,
  isCheckoutAddressComplete,
} from '@/features/checkout/utils/format-delivery-address';
import { resolveProfileIdentity } from '@/features/profile/utils/profile-identity';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { ScreenBackButton } from '@/shared/components/screen-back-button';
import { hapticSoftTap, hapticSuccess } from '@/shared/haptics/feedback';
import { useKeyboardHeight } from '@/shared/hooks/use-keyboard-height';
import { useScrollInputIntoView } from '@/shared/hooks/use-scroll-input-into-view';
import { formTextInputProps } from '@/shared/utils/keyboard';
import { filterPersonNameInput } from '@/shared/utils/person-name';
import {
  selectAddress,
  selectUserName,
  updateDeliveryAddress,
  updateProfileName,
  useAppStore,
} from '@/store/app.store';
import { selectSession, useAuthStore } from '@/store/auth.store';
import { colors } from '@/theme/colors';
import { screenTopPadding } from '@/theme/screen-edge';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const CONTINUE_BUTTON_HEIGHT = 52;
const CHECKOUT_DETAILS_KEYBOARD_OFFSET =
  CONTINUE_BUTTON_HEIGHT + spacing.xxxl + spacing.xl + spacing.lg;

type AddressFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: string;
  optional?: boolean;
  returnKeyType?: 'next' | 'done';
  onSubmitEditing?: () => void;
  autoCapitalize?: 'none' | 'words' | 'sentences';
  maxLength?: number;
  anchorRef?: React.RefObject<ViewType | null>;
  onFocus?: () => void;
};

function AddressField({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  optional,
  returnKeyType = 'next',
  onSubmitEditing,
  autoCapitalize = 'words',
  maxLength,
  anchorRef,
  onFocus,
}: AddressFieldProps) {
  return (
    <View ref={anchorRef} style={styles.fieldGroup}>
      <Text style={styles.label}>
        {label}
        {optional ? (
          <Text style={styles.labelOptional}> (optional)</Text>
        ) : null}
      </Text>
      <View style={styles.inputRow}>
        <View style={styles.inputIconWrap}>
          <AppSymbol name={icon} size={15} tintColor={colors.primary} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={onFocus}
          selectionColor={colors.primary}
          maxLength={maxLength}
          {...formTextInputProps}
        />
      </View>
    </View>
  );
}

function emptyIfDefault(value: string, isDefault: boolean): string {
  if (isDefault) return '';
  return value;
}

export function CheckoutDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef =
    useRef<React.ComponentRef<typeof KeyboardAwareScrollView>>(null);
  const scrollToInput = useScrollInputIntoView(scrollRef);
  const nameAnchorRef = useRef<ViewType>(null);
  const flatAnchorRef = useRef<ViewType>(null);
  const streetAnchorRef = useRef<ViewType>(null);
  const landmarkAnchorRef = useRef<ViewType>(null);
  const cityAnchorRef = useRef<ViewType>(null);
  const stateAnchorRef = useRef<ViewType>(null);
  const zipAnchorRef = useRef<ViewType>(null);
  const continueAnchorRef = useRef<ViewType>(null);
  const keyboardHeight = useKeyboardHeight();

  const userName = useAppStore(selectUserName);
  const address = useAppStore(selectAddress);
  const session = useAuthStore(selectSession);

  const identity = useMemo(
    () => resolveProfileIdentity({ storedName: userName, session }),
    [userName, session],
  );

  const isDefaultAddress =
    address.line1 === DEFAULT_PROFILE.address.line1 &&
    address.line2 === DEFAULT_PROFILE.address.line2;

  const [name, setName] = useState(identity.name);
  const [flatOrHouse, setFlatOrHouse] = useState(
    address.flatOrHouse?.trim() ?? '',
  );
  const [street, setStreet] = useState(
    emptyIfDefault(address.line1, isDefaultAddress),
  );
  const [landmark, setLandmark] = useState(address.landmark?.trim() ?? '');
  const [city, setCity] = useState(
    address.city?.trim() || emptyIfDefault(address.line2, isDefaultAddress),
  );
  const [stateName, setStateName] = useState(address.state?.trim() ?? '');
  const [zipCode, setZipCode] = useState(address.zipCode?.trim() ?? '');

  useEffect(() => {
    const pickedDefault =
      address.line1 === DEFAULT_PROFILE.address.line1 &&
      address.line2 === DEFAULT_PROFILE.address.line2;
    if (pickedDefault) return;

    setStreet(address.line1);
    if (address.city?.trim()) {
      setCity(address.city.trim());
    } else if (address.line2?.trim()) {
      setCity(address.line2.trim());
    }
  }, [address.line1, address.line2, address.city]);

  const trimmedName = name.trim();
  const draftAddress = useMemo(
    () => ({
      ...address,
      flatOrHouse: flatOrHouse.trim(),
      line1: street.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      state: stateName.trim(),
      zipCode: zipCode.trim(),
      line2: formatDeliveryLine2({
        city,
        state: stateName,
        zipCode,
      }),
    }),
    [address, flatOrHouse, street, landmark, city, stateName, zipCode],
  );

  const canContinue =
    (!identity.needsName || trimmedName.length >= 2) &&
    isCheckoutAddressComplete(draftAddress);

  function handlePickLocation() {
    hapticSoftTap();
    router.push('/location');
  }

  function handleContinue() {
    if (!canContinue) return;
    Keyboard.dismiss();

    if (trimmedName !== (useAppStore.getState().userName?.trim() ?? '')) {
      updateProfileName(trimmedName);
    }

    updateDeliveryAddress({
      label:
        address.label === 'Home' && isDefaultAddress ? 'Home' : address.label,
      flatOrHouse: flatOrHouse.trim(),
      line1: street.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      state: stateName.trim(),
      zipCode: zipCode.trim(),
      line2: formatDeliveryLine2({
        city,
        state: stateName,
        zipCode,
      }),
    });

    hapticSuccess();
    router.replace('/checkout');
  }

  function handleBack() {
    hapticSoftTap();
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)');
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />

      <View
        style={[styles.header, { paddingTop: screenTopPadding(insets.top) }]}
      >
        <ScreenBackButton onPress={handleBack} />
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAwareScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              insets.bottom +
              CONTINUE_BUTTON_HEIGHT +
              spacing.xxxl +
              (keyboardHeight > 0
                ? keyboardHeight * 0.15 + spacing.lg
                : spacing.lg),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={CHECKOUT_DETAILS_KEYBOARD_OFFSET}
        extraKeyboardSpace={spacing.xl}
      >
        <Text style={styles.title}>Add delivery details</Text>
        <Text style={styles.subtitle}>
          Please provide your details to proceed with your order.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact details</Text>
          <View ref={nameAnchorRef} style={styles.fieldGroup}>
            <Text style={styles.label}>Full name</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputIconWrap}>
                <AppSymbol
                  name="person.fill"
                  size={15}
                  tintColor={colors.primary}
                />
              </View>
              <TextInput
                value={name}
                onChangeText={(text) => setName(filterPersonNameInput(text))}
                placeholder="Enter your name"
                placeholderTextColor={colors.textTertiary}
                style={styles.input}
                autoCapitalize="words"
                autoCorrect={false}
                textContentType="name"
                returnKeyType="next"
                selectionColor={colors.primary}
                onFocus={() => scrollToInput(nameAnchorRef)}
                {...formTextInputProps}
                maxLength={30}
              />
            </View>
            <Text style={styles.helperText}>
              This name appears on your order receipts.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery address</Text>
            <Pressable
              onPress={handlePickLocation}
              hitSlop={8}
              style={styles.locationBtn}
              accessibilityRole="button"
              accessibilityLabel="Use current location"
            >
              <AppSymbol
                name="location.fill"
                size={12}
                tintColor={colors.primary}
              />
              <Text style={styles.locationBtnText}>Use current location</Text>
            </Pressable>
          </View>

          <AddressField
            label="Flat / house no."
            value={flatOrHouse}
            onChangeText={setFlatOrHouse}
            placeholder="Flat 4B, House 12, etc."
            icon="house.fill"
            maxLength={40}
            anchorRef={flatAnchorRef}
            onFocus={() => scrollToInput(flatAnchorRef)}
          />
          <AddressField
            label="Address line 1"
            value={street}
            onChangeText={setStreet}
            placeholder="Street, sector or area"
            icon="location.fill"
            maxLength={80}
            anchorRef={streetAnchorRef}
            onFocus={() => scrollToInput(streetAnchorRef)}
          />
          <AddressField
            label="Landmark"
            value={landmark}
            onChangeText={setLandmark}
            placeholder="Near park, mall, school, etc."
            icon="tag.fill"
            optional
            maxLength={60}
            anchorRef={landmarkAnchorRef}
            onFocus={() => scrollToInput(landmarkAnchorRef)}
          />
          <AddressField
            label="City"
            value={city}
            onChangeText={setCity}
            placeholder="Enter your city"
            icon="building.columns.fill"
            maxLength={40}
            anchorRef={cityAnchorRef}
            onFocus={() => scrollToInput(cityAnchorRef)}
          />
          <View style={styles.rowFields}>
            <View style={styles.rowField}>
              <AddressField
                label="State"
                value={stateName}
                onChangeText={setStateName}
                placeholder="State"
                icon="map.fill"
                optional
                maxLength={30}
                anchorRef={stateAnchorRef}
                onFocus={() => scrollToInput(stateAnchorRef)}
              />
            </View>
            <View style={styles.rowField}>
              <AddressField
                label="Zip code"
                value={zipCode}
                onChangeText={setZipCode}
                placeholder="Zip code"
                icon="creditcard.fill"
                autoCapitalize="none"
                optional
                maxLength={12}
                anchorRef={zipAnchorRef}
                onFocus={() => {
                  scrollToInput(zipAnchorRef);
                  scrollToInput(
                    continueAnchorRef,
                    CHECKOUT_DETAILS_KEYBOARD_OFFSET,
                  );
                }}
              />
            </View>
          </View>
        </View>

        <View ref={continueAnchorRef}>
          <Pressable
            style={[
              styles.continueBtn,
              !canContinue && styles.continueBtnDisabled,
            ]}
            onPress={handleContinue}
            disabled={!canContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue to payment"
          >
            <Text style={styles.continueBtnText}>Continue to payment</Text>
            <AppSymbol
              name="arrow.right"
              size={14}
              tintColor={colors.textInverse}
            />
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  headerTitle: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 19,
    color: colors.textPrimary,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(36, 155, 66, 0.35)',
    backgroundColor: 'rgba(36, 155, 66, 0.06)',
  },
  locationBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.primary,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  rowFields: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rowField: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  labelOptional: {
    fontFamily: fonts.regular,
    color: colors.textTertiary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 52,
  },
  inputIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderCurve: 'continuous',
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  helperText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textTertiary,
    marginLeft: spacing.xxs,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: 14,
    borderCurve: 'continuous',
    minHeight: 52,
    marginTop: spacing.sm,
  },
  continueBtnDisabled: {
    opacity: 0.45,
  },
  continueBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 19,
    color: colors.textInverse,
  },
});
