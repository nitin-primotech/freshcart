# foodRush — Agent Context

This file is the **single entry point for AI agents** working in this repo. Read it first, then follow links into `docs/` for depth.

## Project snapshot

| Item | Value |
|---|---|
| App | **foodRush** — Expo SDK **56**, React Native **0.85**, React **19** |
| Router | [Expo Router](https://docs.expo.dev/router/introduction/) — routes live in `src/app/` |
| Package manager | **Bun** (`bun install`, `bun run …`) |
| Lint / format | **Biome** (`bun run check`, `bun run lint`, `bun run format`) |
| Git hooks | **Lefthook** — conventional commits + pre-commit lint/format |
| Bundler | **Metro** — SVG as components, CSS enabled for web |

**Always read versioned Expo docs before writing code:**  
https://docs.expo.dev/versions/v56.0.0/

---

## Directory map (current)

```
foodRush/
├── src/
│   ├── app/                          # Routes only — keep screens thin
│   │   ├── _layout.tsx               # Root layout (tabs + splash)
│   │   ├── index.tsx                 # Home tab
│   │   └── explore.tsx               # Explore tab
│   ├── features/                     # Feature modules (self-contained)
│   │   ├── navigation/components/    # Tab shell (NativeTabs)
│   │   ├── home/components/          # Home-specific UI (add as you build)
│   │   └── explore/components/       # Explore-specific UI (add as you build)
│   ├── shared/                       # Cross-feature reusable code
│   │   ├── api/                      # HTTP client scaffold (see docs)
│   │   ├── components/               # Generic UI (ThemedText, ThemedView, …)
│   │   └── hooks/                    # Generic hooks (useTheme, useColorScheme)
│   ├── constants/                    # App-wide constants (theme tokens, strings)
│   ├── providers/                    # App-level React providers (RootProvider)
│   ├── store/                        # Zustand stores (one file per domain)
│   └── theme/                        # Design tokens (colors, fonts, layout)
├── assets/
│   ├── images/
│   └── expo.icon/
├── docs/                             # Human + agent documentation
├── metro.config.js                   # SVG transformer + CSS
├── biome.json                        # Lint + format (80 cols, single quotes)
├── lefthook.yml                      # commit-msg + pre-commit hooks
└── app.json                          # Expo config
```

---

## Architecture rules

### 1. Feature-first

- Code that belongs to **one product area** → `src/features/<feature>/`.
- Code used by **two or more features** → lift to `src/shared/`.
- **Never import across features** directly; go through `shared/` if both need it.

### 2. Thin routes

`src/app/**/*.tsx` files are **route entry points only**:

- Default export required (Expo Router).
- Compose from `@/features/...` and `@/shared/...`.
- No business logic, API calls, or large StyleSheets in route files when avoidable.

### 3. Two theme layers (intentional)

| Layer | Path | Used for |
|---|---|---|
| **Starter theme** | `src/constants/theme.ts` | Current Expo template screens — `Colors`, `Spacing`, `Fonts`, light/dark via `useTheme()` |
| **Product design system** | `src/theme/` | foodRush brand tokens — `colors.ts`, `fonts.ts`, `layout.ts`, `feature-colors.ts` |

When building new screens, prefer `src/theme/colors.ts` and `src/theme/fonts.ts` (see [theme.md](./theme.md)).  
`fonts.ts` requires `@expo-google-fonts/*` packages — install before use.

### 4. State & API (when you add them)

| Concern | Location | Doc |
|---|---|---|
| Global client state | `src/store/*.store.ts` | [state-and-data.md](./state-and-data.md) |
| HTTP | `src/shared/api/` + `src/features/*/api/` | [api-and-networking.md](./api-and-networking.md) |
| Env vars | `.env.local` with `EXPO_PUBLIC_*` | [setup.md](./setup.md) |

---

## Path aliases

From `tsconfig.json`:

| Alias | Resolvess to |
|---|---|
| `@/*` | `src/*` |
| `@/assets/*` | `assets/*` |

```ts
// preferred
import { ThemedText } from '@/shared/components/themed-text';
import { AppTabs } from '@/features/navigation/components/app-tabs';

// avoid deep relative paths
import { ThemedText } from '../../../shared/components/themed-text';
```

Barrel imports exist at `@/shared/components` and `@/shared/hooks`.

---

## Tooling contract

### Biome (`biome.json`)

- 2-space indent, **80** char line width, **single quotes**, trailing commas, semicolons.
- Pre-commit runs `bun run lint` and `bun biome format .` via Lefthook.
- Fix locally: `bun run check` (lint + format write).

### Lefthook (`lefthook.yml`)

- **commit-msg:** conventional commits — `feat:`, `fix:`, `chore:`, etc. (max 72 chars after type).
- **pre-commit:** parallel lint + format check.
- Install hooks: `bun run prepare` (runs on `bun install` via `prepare` script).

### Metro (`metro.config.js`)

- `isCSSEnabled: true` for `src/global.css`.
- SVG files import as React components (`react-native-svg-transformer`).
- Do not remove SVG resolver config if the app uses SVG assets.

---

## Naming & exports

Follow [coding-conventions.md](./coding-conventions.md). Quick reference:

| Kind | Convention | Export |
|---|---|---|
| Route screen | `kebab-case.tsx` in `src/app/` | **default** |
| Component | `kebab-case.tsx` or `PascalCase.tsx` | **named** |
| Hook | `use-*.ts` | **named** |
| Store | `*.store.ts` | **named** |
| API module | `*.api.ts` | **named** |

Import order: React → React Native → third-party → `@/` internal → types.

---

## Adding a new feature (checklist)

1. Create `src/features/<name>/` with only the subfolders you need (`components/`, `hooks/`, `api/`, …).
2. Add route(s) under `src/app/` that import from the feature.
3. Add endpoints to `src/shared/api/config.ts` when networking is involved.
4. Add a Zustand store in `src/store/<name>.store.ts` if state crosses screens.
5. Co-locate tests in `__tests__/` inside the feature or route folder.
6. Run `bun run check` before committing.

---

## Adding a new screen (checklist)

1. Add `src/app/<route>.tsx` (or under a group like `(tabs)/`).
2. Register in tab/stack layout if needed (`src/features/navigation/` or a new `_layout.tsx`).
3. Build UI in `src/features/<feature>/components/`.
4. Wire navigation with typed routes (`experiments.typedRoutes` is on in `app.json`).

---

## What not to do

- Do not put feature logic in `src/app/` beyond composition.
- Do not hardcode hex colors or font sizes — use theme tokens.
- Do not add ESLint/Prettier — this project uses **Biome only**.
- Do not commit `.env.local` or generated `ios/` / `android/` folders.
- Do not edit Expo Router’s `src/app/` tree structure without reason — file names define URLs.
- Do not use **deprecated APIs** — see [agent-prompt.md](./agent-prompt.md) (no RN `Animated`, no `Platform.OS`, no legacy status bar props, etc.).
- Do not use **react-native `Animated`** — use **Reanimated 4** only; never wrap `Link` in `Animated.View`.

---

## Doc index

| File | Purpose |
|---|---|
| [agent-prompt.md](./agent-prompt.md) | **Tight agent prompt** — theme tokens, Reanimated-only, deprecated API replacements |
| [onboarding-flow.md](./onboarding-flow.md) | Onboarding steps, routes, resume logic |
| [setup.md](./setup.md) | Install, run, env vars, quality scripts |
| [project-structure.md](./project-structure.md) | Full folder anatomy + routing |
| [coding-conventions.md](./coding-conventions.md) | Naming, component layout, TypeScript |
| [theme.md](./theme.md) | Colors, fonts, gradients, shadows |
| [state-and-data.md](./state-and-data.md) | Zustand patterns |
| [api-and-networking.md](./api-and-networking.md) | HTTP client, endpoints, recipes |

---

## foodRush demo app

This repo is a **premium food delivery presentation demo** (no backend). See [app-flow.md](./app-flow.md) for user journeys, navigation map, and animation inventory.

**Run:** `bun start` → scan with Expo Go (network needed for food photos + Lottie).
