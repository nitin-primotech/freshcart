import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';

type ProfileAvatarProps = {
  uri?: string | null;
  initials: string;
  size?: number;
  showPersonFallback?: boolean;
};

export function ProfileAvatar({
  uri,
  initials,
  size = 64,
  showPersonFallback = false,
}: ProfileAvatarProps) {
  const radiusValue = size / 2;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: radiusValue },
        ]}
        contentFit="cover"
        transition={200}
        accessibilityLabel="Profile photo"
      />
    );
  }

  if (showPersonFallback) {
    return (
      <View
        style={[
          styles.fallback,
          styles.personFallback,
          { width: size, height: size, borderRadius: radiusValue },
        ]}
      >
        <AppSymbol
          name="person.fill"
          size={Math.round(size * 0.42)}
          tintColor={colors.primary}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: radiusValue },
      ]}
    >
      <Text style={[styles.initials, { fontSize: Math.round(size * 0.3) }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.backgroundMuted,
  },
  fallback: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: 'rgba(36, 155, 66, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  personFallback: {
    backgroundColor: colors.accent,
  },
  initials: {
    fontFamily: fonts.bold,
    lineHeight: 22,
    color: colors.primary,
  },
});
