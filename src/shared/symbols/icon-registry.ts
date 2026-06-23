import type { SymbolViewProps } from 'expo-symbols';

export type CrossPlatformSymbol = Extract<
  SymbolViewProps['name'],
  { ios: string; android: string }
>;

function icon(ios: string, android: string): CrossPlatformSymbol {
  return { ios, android, web: android } as CrossPlatformSymbol;
}

/** SF Symbol name (without `sf:` prefix) → cross-platform symbol config */
export const ICON_REGISTRY: Record<string, CrossPlatformSymbol> = {
  'chevron.left': icon('chevron.left', 'chevron_left'),
  'chevron.right': icon('chevron.right', 'chevron_right'),
  'chevron.down': icon('chevron.down', 'expand_more'),
  'chevron.up': icon('chevron.up', 'expand_less'),
  magnifyingglass: icon('magnifyingglass', 'search'),
  'xmark.circle.fill': icon('xmark.circle.fill', 'cancel'),
  'location.fill': icon('location.fill', 'location_on'),
  'person.fill': icon('person.fill', 'person'),
  'mic.fill': icon('mic.fill', 'mic'),
  heart: icon('heart', 'favorite'),
  'heart.fill': icon('heart.fill', 'favorite'),
  'star.fill': icon('star.fill', 'star'),
  star: icon('star', 'star_border'),
  'fork.knife': icon('fork.knife', 'restaurant'),
  'cart.fill': icon('cart.fill', 'shopping_cart'),
  'takeoutbag.and.cup.and.straw.fill': icon(
    'takeoutbag.and.cup.and.straw.fill',
    'takeout_dining',
  ),
  sparkles: icon('sparkles', 'auto_awesome'),
  plus: icon('plus', 'add'),
  minus: icon('minus', 'remove'),
  trash: icon('trash', 'delete'),
  tray: icon('tray', 'inbox'),
  'wifi.exclamationmark': icon('wifi.exclamationmark', 'wifi_off'),
  clock: icon('clock', 'schedule'),
  bicycle: icon('bicycle', 'pedal_bike'),
  'map.fill': icon('map.fill', 'map'),
  'checkmark.circle.fill': icon('checkmark.circle.fill', 'check_circle'),
  checkmark: icon('checkmark', 'check'),
  'flame.fill': icon('flame.fill', 'local_fire_department'),
  'house.fill': icon('house.fill', 'home'),
  'creditcard.fill': icon('creditcard.fill', 'credit_card'),
  'bell.fill': icon('bell.fill', 'notifications'),
  bell: icon('bell', 'notifications_none'),
  cart: icon('cart', 'shopping_cart'),
  'line.3.horizontal': icon('line.3.horizontal', 'menu'),
  'qrcode.viewfinder': icon('qrcode.viewfinder', 'qr_code_scanner'),
  'questionmark.circle.fill': icon('questionmark.circle.fill', 'help'),
  'clock.arrow.circlepath': icon('clock.arrow.circlepath', 'history'),
  'leaf.fill': icon('leaf.fill', 'eco'),
  'truck.box.fill': icon('truck.box.fill', 'local_shipping'),
  'info.circle': icon('info.circle', 'info'),
  'building.columns.fill': icon('building.columns.fill', 'account_balance'),
  'circle.grid.2x2.fill': icon('circle.grid.2x2.fill', 'grid_view'),
  'birthday.cake.fill': icon('birthday.cake.fill', 'cake'),
  'cup.and.saucer.fill': icon('cup.and.saucer.fill', 'coffee'),
  'bag.fill': icon('bag.fill', 'shopping_bag'),
  'phone.fill': icon('phone.fill', 'phone'),
  'message.fill': icon('message.fill', 'chat'),
  'shippingbox.fill': icon('shippingbox.fill', 'inventory_2'),
  'shield.fill': icon('shield.fill', 'shield'),
  headphones: icon('headphones', 'headphones'),
  'gearshape.fill': icon('gearshape.fill', 'settings'),
  'tag.fill': icon('tag.fill', 'local_offer'),
  'crown.fill': icon('crown.fill', 'workspace_premium'),
  'doc.text.fill': icon('doc.text.fill', 'description'),
  'wallet.pass.fill': icon('wallet.pass.fill', 'account_balance_wallet'),
  'rectangle.portrait.and.arrow.right': icon(
    'rectangle.portrait.and.arrow.right',
    'logout',
  ),
  'square.and.arrow.up': icon('square.and.arrow.up', 'share'),
  'arrow.2.circlepath': icon('arrow.2.circlepath', 'sync'),
  'star.leadinghalf.filled': icon('star.leadinghalf.filled', 'star_half'),
};

export function resolveSymbol(name: string): CrossPlatformSymbol | null {
  const key = name.startsWith('sf:') ? name.slice(3) : name;
  return ICON_REGISTRY[key] ?? null;
}
