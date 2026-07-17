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
import { ScreenBackButton } from '@/shared/components/screen-back-button';
import { hapticSoftTap } from '@/shared/haptics/feedback';
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

  function handleClose() {
    hapticSoftTap();
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
          <ScreenBackButton onPress={handleClose} />
          <Text style={styles.title} numberOfLines={1}>
            {productName}
          </Text>
          <View style={styles.headerSpacer} />
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

        <View
          style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}
        >
          <Pressable
            style={styles.closeBtn}
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Close gallery"
          >
            <AppSymbol name="xmark" size={14} tintColor={colors.textInverse} />
            <Text style={styles.closeBtnText}>Close</Text>
          </Pressable>
        </View>
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
    zIndex: 2,
  },
  headerSpacer: {
    width: 44,
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
    flex: 1,
    minHeight: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  closeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: 14,
    borderCurve: 'continuous',
    minHeight: 48,
  },
  closeBtnText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    lineHeight: 19,
    color: colors.textInverse,
  },
});
