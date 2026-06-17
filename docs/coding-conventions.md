# Coding Conventions

## Naming

### Files and folders

| Type | Convention | Example |
|---|---|---|
| Screen | `kebab-case.tsx` | `partner-detail.tsx` |
| Component | `PascalCase.tsx` | `RewardCard.tsx` |
| Hook | `camelCase.ts` | `useAuth.ts` |
| Utility | `kebab-case.ts` | `format-currency.ts` |
| Type file | `kebab-case.ts` | `partner.types.ts` |
| Zustand store | `kebab-case.store.ts` | `auth.store.ts` |
| Feature API module | `kebab-case.api.ts` | `auth.api.ts` |
| Zod schema | `kebab-case.schema.ts` (lives in feature `utils/`) | `contact-us.schema.ts` |
| Test | `<name>.test.{ts,tsx}` (inside an `__tests__/` folder) | `useLoginForm.test.ts` |

### Variables

```ts
// camelCase for variables and function params
const partnerName = 'Acme Corp';
const isLoading = true;
const hasError = false;

// SCREAMING_SNAKE_CASE for true constants (not config values, actual constants)
const MAX_RETRY_COUNT = 3;

// Booleans — prefix with is / has / can / should
const isVisible = true;
const hasPermission = false;
const canEdit = true;
const shouldRefetch = false;
```

### Functions

```ts
// camelCase, verb-first, describes the action
function fetchPartners() {}
function handleSubmit() {}
function formatCurrency(amount: number) {}
function getPartnerById(id: string) {}
```

### Components

```ts
// PascalCase, noun-first, describes what it renders
function RewardCard() {}
function PartnerListItem() {}
function LoadingSpinner() {}
```

### Types and Interfaces

```ts
// PascalCase
type PartnerStatus = 'active' | 'inactive';

interface Partner {
  id: string;
  name: string;
  status: PartnerStatus;
}

// Props type for a component — suffix with Props
interface RewardCardProps {
  reward: Reward;
  onPress: () => void;
}
```

### Event handlers

```ts
// Prefix with handle, suffix with the event
function handlePress() {}
function handleChangeText(text: string) {}
function handleScrollEnd() {}

// In props, prefix with on
interface Props {
  onPress: () => void;
  onChangeText: (text: string) => void;
}
```

## Component Structure

Keep this order inside a component file:

```tsx
// 1. Imports
import { StyleSheet } from 'react-native';
import { RNView, RNText } from '@/shared/components';

// 2. Types
interface Props {
  title: string;
}

// 3. Component
export function MyComponent({ title }: Props) {
  // 3a. Hooks
  const [count, setCount] = useState(0);

  // 3b. Derived values
  const label = `${title} (${count})`;

  // 3c. Handlers
  function handlePress() {
    setCount(count + 1);
  }

  // 3d. Render
  return (
    <RNView style={styles.container}>
      <RNText onPress={handlePress}>{label}</RNText>
    </RNView>
  );
}

// 4. Styles (always at the bottom)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

### Why Use RNView and RNText?

Always use `RNView` and `RNText` instead of native `View` and `Text` components.

**Benefits:**
- **Centralized theming** — Color, font, spacing updates apply everywhere at once
- **Consistency** — Guaranteed all components follow the same style system
- **Future-proof** — Easy to add theme switching, animations, or global styles without touching component code
- **Maintainability** — One place to fix styling issues instead of scattered throughout the codebase

This is a common pattern in large production apps (Slack, Discord, etc.) and prevents style inconsistencies as the app scales.

## Hooks

```ts
// Feature-specific hooks live in src/features/<feature>/hooks/.
// Cross-feature hooks live in src/shared/hooks/.
// Always prefix with use
// Return an object for multiple values, a single value is fine too

function usePartner(id: string) {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ...

  return { partner, isLoading };
}
```

## TypeScript

- Avoid `any`. Use `unknown` when the type is truly unknown and narrow it.
- Prefer `interface` for object shapes, `type` for unions and primitives.
- Always type function return values when it is not obvious.
- Never use non-null assertion (`!`) — handle the null case explicitly.

```ts
// avoid
const name = user!.name;

// good
const name = user?.name ?? 'Unknown';
```

## Imports Order

Keep imports grouped and in this order (Biome will not enforce order, do it manually):

```ts
// 1. React
import { useState, useEffect } from 'react';

// 2. React Native
import { StyleSheet } from 'react-native';

// 3. Third-party
import { useRouter } from 'expo-router';

// 4. Internal — absolute (@/)
import { RNView, RNText } from '@/shared/components';
import { RewardCard } from '@/features/home';
import { useAuthStore } from '@/store/auth.store';

// 5. Types
import type { AuthSession } from '@/features/auth/types/auth';
```

**Note:** Use `RNView` and `RNText` instead of native `View` and `Text` (see [Component Structure](#component-structure) above).

## General Rules

- **Always use `RNView` and `RNText`** instead of native `View` and `Text` (allows centralized theming).
- One component per file.
- No default exports except for Expo Router screens (`src/app/**`). Use named exports everywhere else.
- Keep components small. If a component exceeds ~150 lines, split it.
- No inline styles — always use `StyleSheet.create`.
- No hardcoded colors or font sizes inline — use a theme/token file.
- `console.log` is allowed during development but clean up before merging.
