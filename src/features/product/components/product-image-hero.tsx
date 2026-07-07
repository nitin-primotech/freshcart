import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import {
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getProductGalleryImages } from '@/features/product/utils/product-gallery';
import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const STAGE_HEIGHT = 300;

type ProductImageHeroProps = {
  primaryImage: string;
  relatedImages: string[];
  discountPercent?: number;
  onViewImages?: () => void;
};

export function ProductImageHero({
  primaryImage,
  relatedImages,
  discountPercent = 0,
  onViewImages,
}: ProductImageHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stageWidth = Dimensions.get('window').width;
  const images = useMemo(
    () => getProductGalleryImages(primaryImage, relatedImages, 6),
    [primaryImage, relatedImages],
  );

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(event.nativeEvent.contentOffset.x / stageWidth);
    setActiveIndex(index);
  }

  return (
    <View style={[styles.wrap, { width: stageWidth }]}>
      <View style={[styles.stage, { width: stageWidth }]}>
        {images.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            decelerationRate="fast"
            contentContainerStyle={styles.galleryRow}
          >
            {images.map((imageUri, index) => (
              <View
                key={`${imageUri}-${index}`}
                style={[styles.slide, { width: stageWidth }]}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                  contentFit="contain"
                  transition={220}
                />
              </View>
            ))}
          </ScrollView>
        ) : null}

        {discountPercent > 0 ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercent}% OFF</Text>
          </View>
        ) : null}

        {onViewImages ? (
          <Pressable
            style={styles.viewImagesBtn}
            onPress={onViewImages}
            accessibilityRole="button"
            accessibilityLabel="View product images"
          >
            <AppSymbol
              name="photo.on.rectangle"
              size={12}
              tintColor={colors.textPrimary}
            />
            <Text style={styles.viewImagesText}>View images</Text>
          </Pressable>
        ) : null}

        {images.length > 1 ? (
          <View style={styles.dots}>
            {images.map((imageUri, index) => (
              <View
                key={`dot-${imageUri}-${index}`}
                style={[styles.dot, index === activeIndex && styles.dotActive]}
              />
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
  },
  stage: {
    height: STAGE_HEIGHT,
    backgroundColor: colors.accentMuted,
    position: 'relative',
  },
  galleryRow: {
    height: STAGE_HEIGHT,
  },
  slide: {
    height: STAGE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  image: {
    width: '100%',
    height: '88%',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 13,
    color: colors.textInverse,
  },
  viewImagesBtn: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  viewImagesText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 13,
    color: colors.textPrimary,
  },
  dots: {
    position: 'absolute',
    bottom: spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderStrong,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 6,
    height: 6,
  },
});
