import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';

// Icons styled exactly like the user's mockup crop but using theme green color

function HomeIcon({ active }: { active: boolean }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H14V14H10V21H4C3.44772 21 3 20.5523 3 20V10.5Z"
        fill={active ? colors.primary : 'none'}
        stroke={active ? colors.primary : '#8E8E93'}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 21V14H15V21"
        stroke={active ? colors.primary : '#8E8E93'}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CategoriesIcon({ active }: { active: boolean }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      {/* Top Left */}
      <Circle
        cx={7}
        cy={7}
        r={3.5}
        fill="none"
        stroke={active ? colors.primary : '#8E8E93'}
        strokeWidth={2.2}
      />
      {/* Top Right */}
      <Circle
        cx={17}
        cy={7}
        r={3.5}
        fill="none"
        stroke={active ? colors.primary : '#8E8E93'}
        strokeWidth={2.2}
      />
      {/* Bottom Left */}
      <Circle
        cx={7}
        cy={17}
        r={3.5}
        fill={active ? '#B0BEC5' : 'none'}
        stroke={active ? colors.primary : '#8E8E93'}
        strokeWidth={2.2}
      />
      {/* Bottom Right */}
      <Circle
        cx={17}
        cy={17}
        r={3.5}
        fill="none"
        stroke={active ? colors.primary : '#8E8E93'}
        strokeWidth={2.2}
      />
    </Svg>
  );
}

function OrdersIcon({ active }: { active: boolean }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 8H19L20 21H4L5 8Z"
        fill={active ? colors.primary : 'none'}
        stroke={active ? colors.primary : '#8E8E93'}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <Path
        d="M9 8C9 8 9 4 12 4C15 4 15 8 15 8"
        stroke={active ? colors.primary : '#8E8E93'}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <Path
        d="M12 16C12 16 10.5 14.5 10.5 13.5C10.5 12.6716 11.1716 12 12 12C12.8284 12 13.5 12.6716 13.5 13.5C13.5 14.5 12 16 12 16Z"
        fill={active ? '#FF7043' : 'none'}
        stroke={active ? colors.primary : '#8E8E93'}
        strokeWidth={active ? 1 : 0}
      />
    </Svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21"
        stroke={active ? colors.primary : '#8E8E93'}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <Circle
        cx={12}
        cy={8}
        r={4}
        fill={active ? colors.primary : 'none'}
        stroke={active ? colors.primary : '#8E8E93'}
        strokeWidth={2.2}
      />
    </Svg>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        if (route.name === 'wishlist' || options.href === null) {
          return null;
        }

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name === 'index'
                ? 'Home'
                : route.name === 'categories'
                  ? 'Categories'
                  : route.name === 'orders'
                    ? 'My Orders'
                    : route.name === 'profile'
                      ? 'Profile'
                      : route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            {/* Horizontal brand green indicator at the top of active tab */}
            {isFocused && <View style={styles.indicator} />}

            <View style={styles.iconContainer}>
              {route.name === 'index' && <HomeIcon active={isFocused} />}
              {route.name === 'categories' && (
                <CategoriesIcon active={isFocused} />
              )}
              {route.name === 'orders' && <OrdersIcon active={isFocused} />}
              {route.name === 'profile' && <ProfileIcon active={isFocused} />}
            </View>
            <Text style={[styles.label, isFocused && styles.labelActive]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function AppTabs() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="categories" options={{ title: 'Categories' }} />
      <Tabs.Screen name="orders" options={{ title: 'My Orders' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="wishlist" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    paddingTop: 8,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.03)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 2,
  },
  indicator: {
    position: 'absolute',
    top: -9, // aligned exactly with top border of tabBar
    width: 32,
    height: 3,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 1.5,
    borderBottomRightRadius: 1.5,
  },
  iconContainer: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 12,
    color: '#8E8E93',
    marginTop: 3,
  },
  labelActive: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
});
