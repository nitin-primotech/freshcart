# Project Structure

foodRush is organised by **feature** rather than by file type. Each feature owns its components, hooks, services, types, and any other code that belongs to it. Cross-feature code lives in `src/shared/`.

```
foodRush/
├── src/
│   ├── app/                       # Expo Router screens (file-based routing — do not reorganise)
│   │   ├── _layout.tsx            # Root layout — tabs + splash overlay
│   │   ├── index.tsx              # Home tab
│   │   └── explore.tsx            # Explore tab
│   ├── features/                  # Feature modules — self-contained
│   │   ├── navigation/
│   │   │   └── components/        # Tab shell (NativeTabs)
│   │   ├── home/
│   │   │   └── components/        # Home-specific UI
│   │   └── explore/
│   │       └── components/        # Explore-specific UI
│   ├── shared/                    # Reusable code that crosses features
│   │   ├── api/                   # Shared HTTP client scaffold
│   │   ├── components/            # Generic UI (ThemedText, ThemedView, …)
│   │   └── hooks/                 # Generic hooks (useTheme, …)
│   ├── store/                     # Zustand stores — one file per domain
│   │   └── index.ts               # Barrel re-exporting every store
│   ├── constants/                 # App-wide constants (starter theme, strings)
│   ├── providers/                 # App-level providers (RootProvider)
│   └── theme/                     # Brand design tokens (colors, fonts, layout)
├── assets/
│   ├── images/
│   └── expo.icon/
├── docs/                          # Project documentation
├── metro.config.js                # Metro — SVG + CSS
├── biome.json                     # Formatter + linter config
├── lefthook.yml                   # Git hooks
├── tsconfig.json                  # TypeScript config
└── package.json
```

> **Agents:** start with [agent-context.md](./agent-context.md) for a concise map of this repo.

## Feature anatomy

A feature is a folder under `src/features/` that owns everything related to one concern. Add subfolders only when the feature needs them — a feature with three components and no hooks should be just `components/`.

| Subfolder | What lives here |
|---|---|
| `components/` | UI components used only by this feature |
| `hooks/` | React hooks used only by this feature |
| `api/` | Network calls (one file per resource) — see [api-and-networking.md](./api-and-networking.md) |
| `services/` | Non-API integrations (storage, native modules, bootstrapping) |
| `providers/` | Context providers scoped to this feature |
| `types/` | Type definitions used across the feature |
| `utils/` | Pure helpers and Zod schemas (named `*.schema.ts`) used only by this feature |
| `mocks/` | Static JSON or fixtures used by the feature in dev |
| `__tests__/` | Jest tests for this feature (auto-discovered by `jest-expo`) |

If a piece of code is genuinely needed by more than one feature, lift it to `src/shared/` rather than reaching across features.

## Path Aliases

Configured in `tsconfig.json`. Use these instead of relative imports.

| Alias | Resolvess to |
|---|---|
| `@/*` | `src/*` |
| `@/assets/*` | `assets/*` |

```ts
// good
import { ThemedText } from '@/shared/components/themed-text';
import { AppTabs } from '@/features/navigation/components/app-tabs';

// avoid
import { ThemedText } from '../../../shared/components/themed-text';
```

## Routing

This project uses [Expo Router](https://docs.expo.dev/router/introduction/) — file-based routing. Every file inside `src/app/` becomes a route automatically. Screen files stay thin and delegate to feature components.

| File | Route |
|---|---|
| `src/app/index.tsx` | `/` (Home tab) |
| `src/app/explore.tsx` | `/explore` |

Navigation chrome (Native Tabs) lives in `src/features/navigation/components/app-tabs.tsx`.

### Adding a new screen

1. Create the route file inside `src/app/` (e.g. `src/app/profile.tsx`).
2. Import the feature components it needs (`@/features/<name>/...`).
3. If it belongs in a tab, add a `<NativeTabs.Trigger>` in `app-tabs.tsx`.

Layouts wrap child screens and are defined with `_layout.tsx` files.

## Theme layers

| Layer | Location | When to use |
|---|---|---|
| Starter (light/dark) | `src/constants/theme.ts` | Existing template screens, `ThemedText`, `ThemedView` |
| Brand design system | `src/theme/` | New product UI — see [theme.md](./theme.md) |

## Tests

Tests are co-located with the code they cover — no top-level `__tests__/` directory.

| Test type | Location | Example |
|---|---|---|
| Feature logic | `src/features/<feature>/__tests__/*.test.{ts,tsx}` | `src/features/auth/__tests__/useLoginForm.test.ts` |
| Screen | `src/app/<route>/__tests__/*.test.tsx` | `src/app/__tests__/index.test.tsx` |
| Shared utility | `src/shared/<area>/__tests__/*.test.ts` | `src/shared/utils/__tests__/assets.test.ts` |

The `__tests__` folder name starts with `_`, so Expo Router ignores it as a route segment — safe to nest inside `src/app/`. `jest-expo` auto-discovers any `**/__tests__/**/*.[jt]s?(x)` or `**/*.{spec,test}.[jt]s?(x)` file.

Run them with:

```sh
bun test           # one-shot — CI / full sweep
bun test:watch     # developer watch loop
```

## Code quality

```sh
bun check          # format + lint (fix)
bun lint           # lint only
bun format         # format only
```

Git hooks (Lefthook) run lint + format on pre-commit and enforce conventional commit messages. See [setup.md](./setup.md).
