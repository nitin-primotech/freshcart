# Theme — Colors & Fonts

## Colors

Every color lives in `src/theme/colors.ts`. Never hardcode a hex value anywhere else.

```ts
import { colors, screens, gradients, shadows } from '@/theme/colors';
```

### `colors` - shared across 2+ screens

```ts
<Text style={{ color: colors.textPrimary }} />
<Text style={{ color: colors.textOnLight }} />
<Text style={{ color: colors.textDanger }} />
<View style={{ backgroundColor: colors.background }} />
<View style={{ backgroundColor: colors.backgroundDark }} />
<View style={{ backgroundColor: colors.buttonPrimary }} />

// Inputs on light screens
<TextInput
  style={{
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBorder,
    color: colors.inputText,
  }}
  placeholderTextColor={colors.inputPlaceholder}
/>

// Inputs on dark / auth screens
<TextInput
  style={{
    backgroundColor: colors.inputBackgroundOnDark,
    borderColor: colors.inputBorderOnDark,
    color: colors.inputTextOnDark,
  }}
  placeholderTextColor={colors.inputPlaceholderOnDark}
/>
```

### `screens` - one screen only

```ts
<Text style={{ color: screens.home.pointsNumber }}>100</Text>
<View style={{ backgroundColor: screens.home.tileRedeem }} />
<View style={{ backgroundColor: screens.tabBar.background }} />
// tab icon: focused ? screens.tabBar.iconActive : screens.tabBar.iconInactive
```

### `gradients`

```ts
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={gradients.primary.colors}
  start={gradients.primary.start}
  end={gradients.primary.end}
/>
```

### `shadows`

```ts
<View style={[styles.card, shadows.card]} />
<View style={[styles.fab, shadows.fab]} />
<View style={[styles.modal, shadows.modal]} />
```

---

## Fonts

Every font lives in `src/theme/fonts.ts`. Never hardcode `fontFamily` or `fontSize`.

### Load once in the root layout

```ts
import { useFonts } from 'expo-font';
import { fontAssets } from '@/theme/fonts';

const [loaded] = useFonts(fontAssets);
if (!loaded) return null;
```

### Usage

```ts
import { Nunito, Benne, DMSerifText } from '@/theme/fonts';

// FontFamily.Weight(figmaSize) returns { fontFamily, fontSize }
<Text style={Nunito.Regular(16)}>Log in to your account</Text>
<Text style={Nunito.Medium(16)}>Email</Text>
<Text style={Nunito.SemiBold(16)}>Signup</Text>
<Text style={Nunito.Bold(16)}>Login</Text>
<Text style={Benne.Regular(24)}>PW Partner Perks</Text>
<Text style={DMSerifText.Regular(48)}>Partner Perks</Text>

// Combine with other styles
<Text style={[Nunito.SemiBold(14), { color: colors.textSecondary }]}>
  First time here?
</Text>
```

### Families and weights

| Call | Weight | Use for |
|------|--------|---------|
| `Nunito.Regular(size)` | 400 | Body, list items, nav labels |
| `Nunito.Medium(size)` | 500 | Input field text |
| `Nunito.SemiBold(size)` | 600 | Emphasis |
| `Nunito.Bold(size)` | 700 | Buttons, titles |
| `Benne.Regular(size)` | 400 | Wordmark only |
| `DMSerifText.Regular(size)` | 400 | Hero headings |

Font sizes are automatically scaled from the Figma base (390pt, iPhone 14 Pro)
and clamped between 85% and 130%. Pass the Figma px value directly.

> Never use `fontWeight` - Android ignores it on custom fonts. Pick the right weight variant instead.
