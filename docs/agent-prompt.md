# foodRush — Agent Prompt & Rules

**Read this before writing or editing code.** Pair with [agent-context.md](./agent-context.md), [theme.md](./theme.md), and the skills listed at the bottom.

---

## Tight prompt (copy-paste for agents)

```text
You are building foodRush — a premium Swiggy-style food delivery demo (Expo SDK 56, React Native 0.85, Expo Router, Bun, Biome, Zustand). No backend; mock JSON + simulated API delays.

Docs: https://docs.expo.dev/versions/v56.0.0/ and docs/agent-prompt.md in this repo.

THEME (never hardcode hex):
- Primary terracotta: #D4543C (buttons, badges, active steps)
- Dark header/nav: #141416 / #1C1C1E
- Page background: #FAF8F5
- Elevated cards: #FFFFFF on #F0EBE4 muted
- Text: primary #1C1C1E, secondary #6B6B70, inverse #FFFFFF on dark headers
- Accent gold: #C9A962 for offers/pills
Import tokens: colors, screens, gradients, shadows from @/theme/colors; typography from @/theme/typography; spacing/radius from @/theme/spacing.

UI components (use these, not starter template):
- PremiumText (all copy), PremiumButton, AppSymbol (icons), AppStatusBar (translucent edge-to-edge)
- GlassCard, Shimmer, EmptyState, ErrorState, FloatingCartBar
- Do NOT use ThemedText/ThemedView for new screens unless extending legacy starter code.

Layout:
- In-app screens: edge-to-edge behind translucent status bar — contentInsetAdjustmentBehavior="never", manual paddingTop via useSafeAreaInsets() + screenTopPadding() from @/theme/screen-edge.
- Tab bottom inset: tabBarContentPadding() / floatingCartBottomOffset() from @/theme/tab-bar — never hardcode tab bar height 56.
- Prefer useWindowDimensions() over Dimensions.get().

Animations — Reanimated 4 ONLY:
- import from react-native-reanimated (FadeIn, useAnimatedStyle, Keyframe, etc.)
- NEVER import Animated from react-native (legacy API).
- Link + animation: Animated.createAnimatedComponent(Pressable) as Link child — never wrap Link in Animated.View.
- Press feedback: useAnimatedStyle + withSpring on Pressable, not LayoutAnimation.

Deprecated — do not use:
- react-native Animated / LayoutAnimation / useNativeDriver
- SafeAreaView from react-native (use react-native-safe-area-context)
- Platform.OS (use process.env.EXPO_OS)
- TextInput onKeyPress (handle backspace/paste in onChangeText)
- expo-status-bar translucent/backgroundColor props (SDK 56: use style only + app.json androidStatusBar)
- sf: URLs on expo-image for icons (use AppSymbol / SymbolView)
- Dimensions.get() at module scope
- Style arrays passed to Link asChild children (flatten with StyleSheet.flatten)
- Legacy shadowColor/elevation (use boxShadow from @/theme/colors shadows)
- @expo/vector-icons, expo-av, expo-permissions, AsyncStorage from react-native

Architecture:
- Routes in src/app/ are thin; UI in src/features/<feature>/components/.
- No cross-feature imports; share via src/shared/.
- State: Zustand in src/store/; persist auth/profile via SecureStore services.
- API: simulated delays in src/features/catalog/api/ — no real network for demo data.

Auth flow: welcome → phone → OTP (1234) → name → location → tabs. Session TTL 10 min.

Before finishing: bunx tsc --noEmit && bun run check. Match existing naming (kebab-case files, named exports except routes).
```

---

## Deprecated APIs → use instead

| Do not use | Use instead |
|---|---|
| `Animated` from `react-native` | `react-native-reanimated` v4 |
| `LayoutAnimation` | Reanimated `layout` / `entering` / `exiting` |
| `useNativeDriver` | Reanimated runs on UI thread by default |
| `SafeAreaView` (RN) | `useSafeAreaInsets()` + padding, or `SafeAreaProvider` |
| `Platform.OS` | `process.env.EXPO_OS` (`'ios'` \| `'android'` \| `'web'`) |
| `Dimensions.get()` | `useWindowDimensions()` inside components |
| `onKeyPress` on `TextInput` | `onChangeText` (backspace, paste, digit logic) |
| `StatusBar` `translucent` / `backgroundColor` props | `AppStatusBar` + `app.json` → `androidStatusBar` |
| `expo-image` `sf:` string URLs | `AppSymbol` / `SymbolView` via `@/shared/symbols/icon-registry` |
| `@expo/vector-icons` | `AppSymbol` |
| `Link asChild` + style array on child | `StyleSheet.flatten([a, b])` or single style object |
| `Animated.View` wrapping `Link asChild` | `Link asChild` → `AnimatedPressable` (`Animated.createAnimatedComponent(Pressable)`) |
| `shadowColor` / `elevation` | `shadows.*` from `@/theme/colors` (`boxShadow`) |
| `ThemedText` / `ThemedView` (new UI) | `PremiumText`, `View`, `Pressable` + theme tokens |
| `contentInsetAdjustmentBehavior="automatic"` on edge-to-edge in-app tabs | `"never"` + `screenTopPadding(insets.top)` |
| Hardcoded `#D4543C`, spacing, font sizes | `@/theme/colors`, `@/theme/spacing`, `@/theme/typography` |
| `fetch` without abort | `useSimulatedQuery` / `AbortSignal` pattern in shared hooks |
| `console.log` in merged code | Remove before PR |

---

## Animation rules (Reanimated 4)

**Allowed**

```tsx
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Enter/exit
<Animated.View entering={FadeIn.duration(300)} exiting={FadeOut} />

// Press scale
const scale = useSharedValue(1);
const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

// Link + enter animation (Fabric-safe)
<Link href="/restaurant/1" asChild>
  <AnimatedPressable entering={FadeInRight.delay(80)} style={styles.card}>
    ...
  </AnimatedPressable>
</Link>
```

**Forbidden**

```tsx
// Legacy RN Animated — never
import { Animated, LayoutAnimation } from 'react-native';

// Fabric crash risk
<Animated.View entering={FadeIn}>
  <Link asChild><Pressable /></Link>
</Animated.View>
```

Keep animations subtle and fast (250–450ms). Prefer `FadeIn`, `FadeInDown`, `FadeInRight`, `withSpring` with damping 12–16.

**Haptics:** always import from `@/shared/haptics/feedback` — never import `react-native-pulsar` directly. Pulsar presets load when the native module is linked (dev build); Expo Go falls back to `expo-haptics` automatically.

---

## Theme contract

All visual work must use foodRush tokens.

### Colors (`@/theme/colors`)

| Token | Hex | Use |
|---|---|---|
| `colors.primary` | `#D4543C` | CTAs, cart bar, active chips |
| `colors.primaryDark` | `#B8433A` | Badge backgrounds |
| `colors.secondary` | `#1C1C1E` | Dark gradients, filter active |
| `colors.background` | `#FAF8F5` | Light screen base |
| `colors.backgroundDark` | `#141416` | Home header gradient top |
| `colors.backgroundElevated` | `#FFFFFF` | Cards, sheets |
| `colors.backgroundMuted` | `#F0EBE4` | Inputs, chips |
| `colors.textPrimary` | `#1C1C1E` | Body on light |
| `colors.textInverse` | `#FFFFFF` | Text on dark headers |
| `colors.accent` | `#C9A962` | Premium / offer accents |

### Typography

Use `PremiumText` with variants: `display`, `h1`, `h2`, `h3`, `sectionTitle`, `body`, `bodyMedium`, `caption`, `label`, `price`, `overline`.

### Spacing & radius

`@/theme/spacing` — `xxs` through `xxxl`; `@/theme/spacing` `radius` — `sm` through `full`. Use `gap` in flex layouts.

### Status bar

| Screen type | `AppStatusBar` style |
|---|---|
| Home, restaurant hero | `light` |
| Search, orders, profile, auth forms | `dark` |

---

## App-specific components

| Need | Component |
|---|---|
| Text | `PremiumText` |
| Button | `PremiumButton` |
| Icon | `AppSymbol` |
| Status bar | `AppStatusBar` |
| Loading placeholder | `Shimmer` |
| Empty / error | `EmptyState`, `ErrorState` |
| Cart chrome | `FloatingCartBar`, `CartBottomSheet` |
| Haptics | `@/shared/haptics/feedback` (Pulsar presets) |
| Tab icons | `NativeTabs.Trigger.Icon` with `sf` + `md` |
| Carousel width | `useCarouselItemWidth` |
| Keyboard forms | `keyboardAvoidingBehavior` from `@/shared/utils/keyboard` |

---

## Navigation & data

- **Tabs:** `NativeTabs` in `@/navigation/components/app-tabs` (native) / `app-tabs.web.tsx` (web).
- **Stack:** restaurant, checkout, order tracking — register in `src/app/_layout.tsx`.
- **Stores:** `auth.store`, `app.store`, `cart.store`, `orders.store`.
- **Mock data:** `src/features/catalog/mocks/*.json`.
- **Simulated API:** `src/features/catalog/api/catalog.api.ts`.

---

## Skills to read (when relevant)

| Skill | When |
|---|---|
| `building-native-ui` | Screens, tabs, navigation, Reanimated, safe area |
| `native-data-fetching` | Network, React Query, loaders |
| `upgrading-expo` | SDK bumps, dependency fixes |
| `expo-tailwind-setup` | Only if adding NativeWind (not default today) |
| `expo-cicd-workflows` | EAS workflows |
| `expo-api-routes` | API routes + EAS Hosting |

Path: `.agents/skills/<name>/SKILL.md` or `~/.agents/skills/<name>/SKILL.md`.

---

## Pre-ship checklist

- [ ] No `Animated` import from `react-native`
- [ ] No hardcoded colors / tab bar height
- [ ] `AppStatusBar` on screens that own the top edge
- [ ] `bunx tsc --noEmit` passes
- [ ] `bun run check` passes
- [ ] Route files stay thin; logic in `src/features/`
