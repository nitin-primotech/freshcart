import { Image } from 'expo-image';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppSymbol } from '@/shared/components/app-symbol';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type ProductImageGalleryModalProps = {
  visible: boolean;
  images: string[];
  productName: string;
  initialIndex?: number;
  onClose: () => void;
};

export function ProductImageGalleryModal({
  visible,
  images,
  productName,
  initialIndex = 0,
  onClose,
}: ProductImageGalleryModalProps) {
  const insets = useSafeAreaInsets();
  const stageWidth = Dimensions.get('window').width;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
          <Pressable
            onPress={onClose}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Close gallery"
          >
            <AppSymbol name="xmark" size={18} tintColor={colors.textPrimary} />
          </Pressable>
          <Text style={styles.title} numberOfLines={1}>
            {productName}
          </Text>
          <View style={styles.closeBtn} />
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: stageWidth * initialIndex, y: 0 }}
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
                transition={200}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 19,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  galleryRow: {
    alignItems: 'center',
  },
  slide: {
    height: '88%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
