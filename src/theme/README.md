# Theme

Two files. Everything design-related lives here and **nowhere else**.

| File | What it owns |
|------|-------------|
| `colors.ts` | Every color value in the app |
| `fonts.ts` | Every font family, weight, and size |

---

## Colors

### Import

```ts
import { colors, screens, gradients, shadows } from '@/theme/colors';
```

### `colors` — shared tokens (used on 2+ screens)

```ts
// Text
<Text style={{ color: colors.textPrimary }}>Welcome back</Text>
<Text style={{ color: colors.textOnLight }}>Card content</Text>
<Text style={{ color: colors.textDanger }}>Invalid email</Text>

// Backgrounds
<View style={{ backgroundColor: colors.background }} />
<View style={{ backgroundColor: colors.backgroundDark }} />
<View style={{ backgroundColor: colors.glass }} />

// Buttons
<View style={{ backgroundColor: colors.buttonPrimary }} />
<Text style={{ color: colors.buttonPrimaryLabel }}>Login</Text>

// Inputs (light screen)
<TextInput
  style={{
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBorder,
    color: colors.inputText,
  }}
  placeholderTextColor={colors.inputPlaceholder}
/>

// Inputs (dark / auth screens)
<TextInput
  style={{
    backgroundColor: colors.inputBackgroundOnDark,
    borderColor: colors.inputBorderOnDark,
    color: colors.inputTextOnDark,
  }}
  placeholderTextColor={colors.inputPlaceholderOnDark}
/>

// Status
<View style={{ backgroundColor: colors.dangerBackground }}>
  <Text style={{ color: colors.danger }}>Something went wrong</Text>
</View>
```

### `screens` — screen-specific tokens (used on ONE screen only)

```ts
// home screen
<Text style={{ color: screens.home.pointsNumber }}>100</Text>
<View style={{ backgroundColor: screens.home.tileRedeem }} />

// tab bar
<View style={{ backgroundColor: screens.tabBar.background }} />
icon color = focused ? screens.tabBar.iconActive : screens.tabBar.iconInactive

// scan FAB
<View style={{ backgroundColor: screens.scan.fabFill }} />
```

### `gradients` — expo-linear-gradient

```ts
import { gradients } from '@/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={gradients.primary.colors}
  start={gradients.primary.start}
  end={gradients.primary.end}
>
  <Text>Login</Text>
</LinearGradient>
```

### `shadows`

```ts
import { shadows } from '@/theme/colors';

<View style={[styles.card, shadows.card]} />
<View style={[styles.fab, shadows.fab]} />
<View style={[styles.modal, shadows.modal]} />
```

### Rules

- **Never** hardcode a hex value anywhere outside this file
- Use `colors.*` for anything shared across 2+ screens
- Use `screens.*` for anything that only appears on one screen
- Add new tokens here first, then use them — don't inline one-offs

---

## Fonts

### Load once in the root layout

```ts
import { useFonts } from 'expo-font';
import { fontAssets } from '@/theme/fonts';

export default function RootLayout() {
  const [loaded] = useFonts(fontAssets);
  if (!loaded) return null;
  return <Stack />;
}
```

### Import & use

```ts
import { Nunito, Benne, DMSerifText } from '@/theme/fonts';
```

`FontFamily.Weight(figmaSize)` returns `{ fontFamily, fontSize }` — spread it straight into any style.

```ts
// Nunito — body, UI, buttons
<Text style={Nunito.Regular(16)}>Log in to your account</Text>
<Text style={Nunito.Medium(16)}>Email</Text>
<Text style={Nunito.SemiBold(16)}>Signup</Text>
<Text style={Nunito.Bold(16)}>Login</Text>

// Benne — wordmark
<Text style={Benne.Regular(24)}>PW Partner Perks</Text>

// DM Serif Text — hero headings
<Text style={DMSerifText.Regular(48)}>Partner Perks</Text>
```

### Combine with other styles

```ts
<Text style={[Nunito.SemiBold(14), { color: colors.textSecondary }]}>
  First time here?
</Text>

<Text style={[Nunito.Bold(16), { color: colors.buttonPrimaryLabel }]}>
  Login
</Text>
```

### Responsive scaling

Font sizes are automatically scaled from the Figma base (390 pt, iPhone 14 Pro) to the actual screen width, clamped between 85%–130%. Pass the exact px value from Figma — no manual math.

### Families & weights

| Import | Weight | Use for |
|--------|--------|---------|
| `Nunito.Regular` | 400 | Body, list items, nav labels, paragraphs |
| `Nunito.Medium` | 500 | Input field text |
| `Nunito.SemiBold` | 600 | Emphasis, "Signup" |
| `Nunito.Bold` | 700 | Buttons, section titles, screen titles |
| `Benne.Regular` | 400 | "PW Partner Perks" wordmark only |
| `DMSerifText.Regular` | 400 | Hero / card big headings |

### Rules

- **Never** hardcode `fontFamily` or `fontSize` outside this file
- **Never** use `fontWeight` — Android ignores it on custom fonts; pick the correct weight instead
- Always load `fontAssets` before rendering any text
- Pass the Figma px value directly — `rs()` handles the rest
