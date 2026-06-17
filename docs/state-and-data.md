# State & Data

This project uses **[Zustand](https://zustand.docs.pmnd.rs/)** for shared client state. There is no Provider — stores are plain hooks, importable anywhere.

## When to use what

| Situation | Use |
|---|---|
| Auth token, user session | Zustand store (`src/store/*.store.ts`) |
| Other state shared across screens | Zustand store |
| UI state local to one screen (modal open, selected tab) | `useState` — do not put in a global store |
| Form state | `react-hook-form` |
| Device storage (SecureStore, MMKV) | A service module under the feature, e.g. `src/features/auth/services/storage.ts` |
| Network calls | A service module under the feature, e.g. `src/features/auth/api/auth.api.ts` |

> If state does not need to be shared across screens, keep it local with `useState`. A global store is for state that genuinely needs to cross screen boundaries.

---

## Store layout

One store file per domain inside `src/store/`, named `<domain>.store.ts`. Each store exports:

- A **store hook** (`useXxxStore`) — components subscribe with selectors
- **Action functions** that mutate the store via `setState`
- **Selector functions** that read a narrow piece of state

The barrel `src/store/index.ts` re-exports everything for convenience.

```ts
// src/store/auth.store.ts
import { create } from 'zustand';

import type { AuthSession, HydratedAuthState } from '@/features/auth/types/auth';

type AuthState = {
  hydrationStatus: 'loading' | 'ready';
  isAuthenticated: boolean;
  registeredAccount: HydratedAuthState['registeredAccount'];
  session: AuthSession | null;
};

const initialState: AuthState = {
  hydrationStatus: 'loading',
  isAuthenticated: false,
  registeredAccount: null,
  session: null,
};

export const useAuthStore = create<AuthState>(() => initialState);

export function hydrateAuthState(payload: HydratedAuthState) {
  useAuthStore.setState({
    hydrationStatus: 'ready',
    isAuthenticated: payload.isAuthenticated,
    registeredAccount: payload.registeredAccount,
    session: payload.session,
  });
}

export function clearAuthState() {
  useAuthStore.setState({
    isAuthenticated: false,
    registeredAccount: null,
    session: null,
  });
}

export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectRegisteredAccount = (state: AuthState) => state.registeredAccount;
```

### Why actions live outside the `create` callback

Keeping mutators as plain functions (instead of inside the store object) means:

- Call sites don't have to subscribe to the store just to call them — `hydrateAuthState(x)` works anywhere, including outside React.
- The store hook only returns state, so selectors are simpler and re-renders are cheaper.

If an action needs to read state, use `useAuthStore.getState()` inside the function.

---

## Reading state in components

Always pass a **selector** to the hook so the component only re-renders when its piece of state changes.

```tsx
import { selectIsAuthenticated, useAuthStore } from '@/store/auth.store';

export function NavGate({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (!isAuthenticated) return <LoginScreen />;
  return <>{children}</>;
}
```

Avoid `useAuthStore()` with no selector — it subscribes the component to the entire store and re-renders on every change.

---

## Writing state

Call the action function directly. There is no dispatcher, no provider, no hook required.

```tsx
import { clearAuthState } from '@/store/auth.store';

async function handleLogout() {
  await authService.clearLocalAuthAndLogout();
  clearAuthState();
}
```

Inside `useEffect`, you can call actions without listing them as dependencies — they are module-level functions, not values closed over from React state.

```tsx
useEffect(() => {
  return authService.subscribe((nextState) => {
    syncAuthState(nextState);
  });
}, []);
```

---

## Reading state outside React

Anywhere a hook can't run (services, utility functions, action callbacks), use `getState`.

```ts
import { useAuthStore } from '@/store/auth.store';

export async function attachAuthHeader(headers: Headers) {
  const session = useAuthStore.getState().session;
  if (session) {
    headers.set('Authorization', `Bearer ${session.accessToken.token}`);
  }
}
```

For one-off subscriptions outside React, use `useAuthStore.subscribe(listener)`.

---

## Server data

There is no global query cache in this project. For network calls:

- Put fetch logic in a feature's `api/` folder, e.g. `src/features/auth/api/auth.api.ts`.
- Call it from a service or directly from a component effect, depending on whether the result needs to live in a store.
- If you need request deduplication, retries, or background refetch, reach for a dedicated data-fetching library — don't reinvent it on top of Zustand.

See [api-and-networking.md](./api-and-networking.md) for the HTTP client, endpoint registry, and the recipes for load / submit / upload / cancel patterns.

---

## Services

Services live inside the feature they belong to and are plain TypeScript — no store involved.

```ts
// src/features/auth/services/storage.ts
import * as SecureStore from 'expo-secure-store';

export async function getStoredAuthSession() {
  const raw = await SecureStore.getItemAsync('auth.session');
  return raw ? (JSON.parse(raw) as AuthSession) : null;
}
```

If a service result needs to land in a store (e.g. reading a token from storage on app start), call the store's action function from the place that invokes the service — never import a store hook inside a service file.
