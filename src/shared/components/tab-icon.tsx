import type { ColorValue } from 'react-native';

import { AppSymbol } from '@/shared/components/app-symbol';

export type TabIconName =
  | 'home'
  | 'categories'
  | 'search'
  | 'orders'
  | 'profile';

const TAB_ICONS: Record<TabIconName, string> = {
  home: 'house.fill',
  categories: 'square.grid.2x2.fill',
  search: 'magnifyingglass',
  orders: 'bag.fill',
  profile: 'person.fill',
};

type TabIconProps = {
  name: TabIconName;
  color: ColorValue;
};

export function TabIcon({ name, color }: TabIconProps) {
  return (
    <AppSymbol
      name={TAB_ICONS[name]}
      size={24}
      tintColor={color}
      weight="semibold"
    />
  );
}
