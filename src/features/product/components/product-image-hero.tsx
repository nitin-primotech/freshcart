import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getProductGalleryImages } from '@/features/product/utils/product-gallery';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

const STAGE_HEIGHT = 248;
const H_PAD = spacing.lg;

type ProductImageHeroProps = {
  primaryImage: string;
  relatedImages: string[];
  discountPercent?: number;
};

export function ProductImageHero({
  primaryImage,
  relatedImages,
  discountPercent = 0,
}: ProductImageHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stageWidth = Dimensions.get('window').width - H_PAD * 2;
  const images = useMemo(
    () => getProductGalleryImages(primaryImage, relatedImages, 3),
    [primaryImage, relatedImages],
  );

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(event.nativeEvent.contentOffset.x / stageWidth);
    setActiveIndex(index);
  }

  return (
    <View style={styles.wrap}>
      <View style={[styles.stage, { width: stageWidth }]}>
        <LinearGradient
          colors={['#FFFDFB', '#F8F1EA', '#F3E8DE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.glow} />
        <View style={styles.pedestal} />

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
      </View>

      {images.length > 1 ? (
        <View style={styles.dots}>
          {images.map((imageUri, index) => (
            <View
              key={`dot-${imageUri}-${index}`}
              style={[
                styles.dot,
                index === activeIndex ? styles.dotActive : null,
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  stage: {
    height: STAGE_HEIGHT,
    borderRadius: 18,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFDFB',
    boxShadow: '0 10px 28px rgba(28, 28, 30, 0.08)',
  },
  glow: {
    position: 'absolute',
    top: '18%',
    alignSelf: 'center',
    width: '62%',
    height: '62%',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },
  pedestal: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    width: '54%',
    height: 18,
    borderRadius: 999,
    backgroundColor: 'rgba(212, 84, 60, 0.08)',
  },
  galleryRow: {
    alignItems: 'center',
  },
  slide: {
    height: STAGE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    boxShadow: '0 4px 10px rgba(212, 84, 60, 0.24)',
  },
  discountText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textInverse,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderStrong,
  },
  dotActive: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textSecondary,
  },
});
