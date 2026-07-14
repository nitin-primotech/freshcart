import { Image } from 'expo-image';
import { type Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  filterOrdersByTab,
  type OrderTabId,
} from '@/features/orders/constants/orders.constants';
import { mergeOrdersWithDemo } from '@/features/orders/mocks/demo-orders';
import {
  formatProfilePhone,
  PROFILE_ACCOUNT_ITEMS,
  PROFILE_AVATAR_URI,
  PROFILE_ORDER_SHORTCUTS,
  PROFILE_PREFERENCE_ITEMS,
  PROFILE_SUPPORT_ITEMS,
  PROFILE_WALLET_STATS,
  type ProfileLinkItem,
  profileDisplayName,
  profileEmailFromName,
} from '@/features/profile/constants/profile.constants';
import { AppConfirmModal } from '@/shared/components/app-confirm-modal';
import { AppStatusBar } from '@/shared/components/app-status-bar';
import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import {
  resetAppProfile,
  selectUserName,
  useAppStore,
} from '@/store/app.store';
import {
  clearAuthState,
  selectUserPhone,
  useAuthStore,
} from '@/store/auth.store';
import { selectOrders, useOrdersStore } from '@/store/orders.store';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { tabBarContentPadding } from '@/theme/tab-bar';
import { fonts } from '@/theme/typography';

function ProfileMenuRow({
  item,
  darkMode,
  onDarkModeChange,
  onPress,
  isLast,
}: {
  item: ProfileLinkItem;
  darkMode: boolean;
  onDarkModeChange: (value: boolean) => void;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={item.toggle ? undefined : onPress}
      style={[styles.menuRow, !isLast && styles.menuRowBorder]}
      accessibilityRole={item.toggle ? 'none' : 'button'}
      accessibilityLabel={item.title}
    >
      <View style={styles.menuIconWrap}>
        <AppSymbol name={item.icon} size={18} tintColor={colors.primary} />
      </View>
      <Text style={styles.menuTitle}>{item.title}</Text>
      {item.trailing ? (
        <Text style={styles.menuTrailing}>{item.trailing}</Text>
      ) : null}
      {item.toggle ? (
        <Switch
          value={darkMode}
          onValueChange={onDarkModeChange}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={colors.backgroundElevated}
        />
      ) : (
        <AppSymbol
          name="chevron.right"
          size={12}
          tintColor={colors.textTertiary}
        />
      )}
    </Pressable>
  );
}

export function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const phone = useAuthStore(selectUserPhone);
  const userName = useAppStore(selectUserName);
  const storeOrders = useOrdersStore(selectOrders);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const displayName = profileDisplayName(userName);
  const displayPhone = formatProfilePhone(phone);
  const displayEmail = profileEmailFromName(displayName);

  const orders = useMemo(() => mergeOrdersWithDemo(storeOrders), [storeOrders]);
  const orderBadges = useMemo(
    () => ({
      all: orders.length,
      ongoing: filterOrdersByTab(orders, 'ongoing').length,
    }),
    [orders],
  );

  async function performLogout() {
    setLogoutModalVisible(false);
    await clearAuthState();
    await resetAppProfile();
    router.replace('/login');
  }

  function handleLogout() {
    hapticSoftTap();
    setLogoutModalVisible(true);
  }

  function openOrders(tab: OrderTabId = 'all') {
    hapticSoftTap();
    router.push({
      pathname: '/(tabs)/orders',
      params: { tab },
    });
  }

  function openRoute(href?: string) {
    if (!href) return;
    hapticSoftTap();
    router.push(href as Href);
  }

  function handleMenuPress(item: ProfileLinkItem) {
    if (item.href) {
      openRoute(item.href);
    }
  }

  return (
    <View style={styles.root}>
      <AppStatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => openRoute('/(tabs)/profile')}
            hitSlop={10}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <AppSymbol name="bell" size={20} tintColor={colors.textPrimary} />
            <View style={styles.notifDot} />
          </Pressable>
          <Pressable
            onPress={() => openRoute('/profile/edit')}
            hitSlop={10}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <AppSymbol
              name="gearshape.fill"
              size={20}
              tintColor={colors.textPrimary}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.screen}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: tabBarContentPadding(insets.bottom) },
        ]}
      >
        <View style={styles.userCard}>
          <Pressable
            onPress={() => openRoute('/profile/edit')}
            style={styles.userTop}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
          >
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: PROFILE_AVATAR_URI }}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.editBadge}>
                <AppSymbol
                  name="square.and.pencil"
                  size={11}
                  tintColor={colors.textInverse}
                  weight="semibold"
                />
              </View>
            </View>

            <View style={styles.userCopy}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userMeta}>{displayPhone}</Text>
              <Text style={styles.userMeta}>{displayEmail}</Text>
              <View style={styles.clubBadge}>
                <AppSymbol
                  name="crown.fill"
                  size={10}
                  tintColor={colors.primary}
                />
                <Text style={styles.clubBadgeText}>FreshCart Club</Text>
              </View>
            </View>

            <AppSymbol
              name="chevron.right"
              size={14}
              tintColor={colors.textTertiary}
            />
          </Pressable>

          <View style={styles.statsRow}>
            {PROFILE_WALLET_STATS.map((stat, index) => (
              <Pressable
                key={stat.id}
                onPress={() => openRoute(stat.href)}
                style={[styles.statCol, index > 0 && styles.statDivider]}
                accessibilityRole="button"
                accessibilityLabel={`${stat.label}, ${stat.value}`}
              >
                <AppSymbol
                  name={stat.icon}
                  size={18}
                  tintColor={colors.primary}
                />
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue} numberOfLines={1}>
                  {stat.value}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>My Orders</Text>
            <Pressable
              onPress={() => openOrders('all')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="View all orders"
            >
              <Text style={styles.sectionLink}>View All Orders {'>'}</Text>
            </Pressable>
          </View>

          <View style={styles.orderShortcuts}>
            {PROFILE_ORDER_SHORTCUTS.map((shortcut) => {
              const badge =
                shortcut.id === 'all'
                  ? orderBadges.all
                  : shortcut.id === 'ongoing'
                    ? orderBadges.ongoing
                    : 0;

              return (
                <Pressable
                  key={shortcut.id}
                  onPress={() => openOrders(shortcut.id)}
                  style={styles.orderShortcut}
                  accessibilityRole="button"
                  accessibilityLabel={shortcut.label}
                >
                  <View style={styles.orderShortcutIconWrap}>
                    <AppSymbol
                      name={shortcut.icon}
                      size={20}
                      tintColor={colors.primary}
                    />
                    {badge > 0 ? (
                      <View style={styles.orderBadge}>
                        <Text style={styles.orderBadgeText}>{badge}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.orderShortcutLabel} numberOfLines={2}>
                    {shortcut.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account</Text>
          {PROFILE_ACCOUNT_ITEMS.map((item, index) => (
            <ProfileMenuRow
              key={item.id}
              item={item}
              darkMode={darkMode}
              onDarkModeChange={setDarkMode}
              onPress={() => handleMenuPress(item)}
              isLast={index === PROFILE_ACCOUNT_ITEMS.length - 1}
            />
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {PROFILE_PREFERENCE_ITEMS.map((item, index) => (
            <ProfileMenuRow
              key={item.id}
              item={item}
              darkMode={darkMode}
              onDarkModeChange={setDarkMode}
              onPress={() => handleMenuPress(item)}
              isLast={index === PROFILE_PREFERENCE_ITEMS.length - 1}
            />
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Support & More</Text>
          {PROFILE_SUPPORT_ITEMS.map((item, index) => (
            <ProfileMenuRow
              key={item.id}
              item={item}
              darkMode={darkMode}
              onDarkModeChange={setDarkMode}
              onPress={() => handleMenuPress(item)}
              isLast={index === PROFILE_SUPPORT_ITEMS.length - 1}
            />
          ))}
        </View>

        <Pressable
          onPress={handleLogout}
          style={styles.logoutBtn}
          accessibilityRole="button"
          accessibilityLabel="Logout"
        >
          <AppSymbol
            name="rectangle.portrait.and.arrow.right"
            size={16}
            tintColor={colors.danger}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>

      <AppConfirmModal
        visible={logoutModalVisible}
        title="Log out?"
        message="You will need to sign in again to access your account."
        confirmLabel="Log out"
        icon="rectangle.portrait.and.arrow.right"
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={() => {
          void performLogout();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundMuted,
  },
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    minHeight: 44,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 19,
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  userCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  userTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundMuted,
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.backgroundElevated,
  },
  userCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  userName: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  userMeta: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  clubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: colors.successLight,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  clubBadgeText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    lineHeight: 12,
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: spacing.md,
    paddingHorizontal: 4,
  },
  statDivider: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: colors.border,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 14,
    color: colors.primary,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionHeaderTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 19,
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    lineHeight: 19,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionLink: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 15,
    color: colors.primary,
  },
  orderShortcuts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
  },
  orderShortcut: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  orderShortcutIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  orderBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.backgroundElevated,
  },
  orderBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    lineHeight: 11,
    color: colors.textInverse,
  },
  orderShortcutLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
  },
  menuRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  menuIconWrap: {
    width: 28,
    alignItems: 'center',
  },
  menuTitle: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 15,
    color: colors.textPrimary,
  },
  menuTrailing: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 13,
    color: colors.textSecondary,
    marginRight: 4,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    marginTop: spacing.xxs,
  },
  logoutText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.danger,
  },
});
