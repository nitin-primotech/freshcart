import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { HomeSectionHeader } from '@/features/home/components/home-section-header';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

// Vector illustrations for fallback items
function BooksSvg({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 14L16 18L20 15L8 11L4 14Z" fill="#E08244" />
      <Path d="M20 15V17L8 13V11L20 15Z" fill="#B35D2B" />
      <Path d="M4 10L16 14L20 11L8 7L4 10Z" fill="#4B9CD3" />
      <Path d="M20 11V13L8 9V7L20 11Z" fill="#2B72A8" />
      <Path d="M16 14L16 16L18 15V13L16 14Z" fill="#E0E0E0" />
    </Svg>
  );
}

function PharmaSvg({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} fill="#4FC3F7" />
      <Path
        d="M12 8V16M8 12H16"
        stroke="#FFFFFF"
        strokeWidth={3.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function GiftsSvg({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={6} width={18} height={12} rx={2} fill="#D32F2F" />
      <Path d="M11 6H13V18H11V6Z" fill="#FFEB3B" />
      <Path d="M3 11H21V13H3V11Z" fill="#FFEB3B" />
      <Circle cx={12} cy={12} r={3.5} fill="#FBC02D" />
    </Svg>
  );
}

function JewellerySvg({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={9} cy={13} r={5} stroke="#FBC02D" strokeWidth={3.5} />
      <Circle cx={15} cy={10} r={5} stroke="#F9A825" strokeWidth={3.5} />
    </Svg>
  );
}

const LIFESTYLE_ITEMS = [
  {
    id: 'spiritual',
    name: 'Spiritual\nNeeds',
    bgColor: '#FDF6E2',
    image: require('@/assets/images/lifestyle_spiritual.png'),
    href: '/category/cat-fruits-veg' as const,
  },
  {
    id: 'pet',
    name: 'Pet\nStore',
    bgColor: '#EDF3E8',
    image: require('@/assets/images/lifestyle_pet.png'),
    href: '/category/cat-snacks' as const,
  },
  {
    id: 'fashion',
    name: 'Fashion\nBasics',
    bgColor: '#ECEFFD',
    image: require('@/assets/images/lifestyle_fashion.png'),
    href: '/category/cat-personal-care' as const,
  },
  {
    id: 'toy',
    name: 'Toy\nStore',
    bgColor: '#FDECE7',
    image: require('@/assets/images/lifestyle_toy.png'),
    href: '/category/cat-snacks' as const,
  },
  {
    id: 'books',
    name: 'Book\nStore',
    bgColor: '#F3F3F3',
    renderIcon: (size: number) => <BooksSvg size={size} />,
    href: '/category/cat-cereals' as const,
  },
  {
    id: 'pharma',
    name: 'Pharma\nStore',
    bgColor: '#E3F3FD',
    renderIcon: (size: number) => <PharmaSvg size={size} />,
    href: '/category/cat-personal-care' as const,
  },
  {
    id: 'gifts',
    name: 'E-Gifts\nStore',
    bgColor: '#FEF7D1',
    renderIcon: (size: number) => <GiftsSvg size={size} />,
    href: '/category/cat-pantry' as const,
  },
  {
    id: 'jewellery',
    name: 'Jewellery\nStore',
    bgColor: '#FCEEF3',
    renderIcon: (size: number) => <JewellerySvg size={size} />,
    href: '/category/cat-bakery' as const,
  },
];

export function DietLifestyleSection() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const contentWidth = width - spacing.md * 2;
  const cardWidth = (contentWidth - 8 * 3) / 4;
  const cardHeight = cardWidth * 1.12;
  const artworkWidth = Math.round(cardWidth * 0.96);
  const artworkHeight = Math.round(cardHeight * 0.72);
  const iconSize = Math.round(cardWidth * 0.62);

  return (
    <View style={styles.wrap}>
      <HomeSectionHeader title="Picks for your lifestyle" />
      <View style={styles.grid}>
        {LIFESTYLE_ITEMS.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.card,
              {
                width: cardWidth,
                height: cardHeight,
                backgroundColor: item.bgColor,
              },
            ]}
            onPress={() => router.push(item.href)}
            accessibilityRole="button"
            accessibilityLabel={item.name.replace('\n', ' ')}
          >
            <Text style={styles.label}>{item.name}</Text>
            <View
              style={[
                styles.artworkContainer,
                {
                  width: artworkWidth,
                  height: artworkHeight,
                },
              ]}
            >
              {item.image ? (
                <Image
                  source={item.image}
                  style={styles.image}
                  contentFit="contain"
                  contentPosition="bottom right"
                />
              ) : (
                <View style={styles.iconWrap}>
                  {item.renderIcon?.(iconSize)}
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: 8,
    marginTop: spacing.xs,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  label: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    right: spacing.xs,
    zIndex: 1,
    fontFamily: fonts.bold,
    fontSize: 10,
    lineHeight: 12,
    color: '#1C1C1E',
  },
  artworkContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  iconWrap: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
