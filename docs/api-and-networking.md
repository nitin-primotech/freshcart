# API & Networking

All HTTP traffic in this app goes through a single client built on
[`react-native-nitro-fetch`](https://github.com/margelo/react-native-nitro-fetch).
Nitro Fetch is a Cronet/URLSession-backed `fetch` — HTTP/2, HTTP/3 over QUIC,
Brotli, and disk cache, none of which RN's default XHR-based `fetch` gives you.

You will not import `react-native-nitro-fetch` directly outside `src/shared/api/`.
Use the `api` namespace below.

---

## Where things live

```
src/shared/api/
├── client.ts        # api.get / api.post / ... + apiRequest (escape hatch)
├── config.ts        # base URL + timeout (driven by EXPO_PUBLIC_* env vars)
├── endpoints.ts     # central path registry, grouped by feature
├── errors.ts        # ApiRequestError, ApiAuthenticationError, ApiTimeoutError, ApiNetworkError
└── index.ts         # barrel — import from here
```

```
src/features/<feature>/api/
└── <resource>.api.ts  # typed functions per resource — the ONLY layer that calls the client
```

---

## Configuration

Set these in a `.env` file at the repo root (gitignored). They get baked into
the bundle at build time:

```sh
EXPO_PUBLIC_API_BASE_URL=https://api.staging.example.com
EXPO_PUBLIC_API_TIMEOUT_MS=15000
```

Anything not prefixed with `EXPO_PUBLIC_` is not visible to the app. If the base
URL is unset, the client falls back to `http://localhost:3000` so dev still works.

---

## The `api` namespace

```ts
import { api } from '@/shared/api';

api.get<T>(path, options?)              // GET
api.post<T>(path, body?, options?)      // POST
api.put<T>(path, body?, options?)       // PUT
api.patch<T>(path, body?, options?)     // PATCH
api.delete<T>(path, options?)           // DELETE
api.request<T>(path, options?)          // escape hatch — pass `method` yourself
```

### Options

| Option | Default | What it does |
|---|---|---|
| `requiresAuth` | `true` | Inject `Authorization: Bearer <token>` and trigger refresh on 401. Set `false` for login/register/public endpoints. |
| `retryOnUnauthorized` | `true` | After a 401, force-refresh the session and retry once. |
| `timeoutMs` | `15000` | Aborts the request if it hasn't completed. Set `0` to disable. |
| `signal` | — | Pass an `AbortSignal` for component-unmount cancellation. Combined with the timeout. |
| `parseAs` | `'json'` | `'json'` parses, `'text'` returns the string, `'response'` returns the raw `Response`. |
| `baseUrl` | `API_CONFIG.baseUrl` | Override for hitting a different host. |
| `headers` | — | Merged on top of defaults (`Content-Type` and `Accept` are auto-set). |

`body` is auto-serialized:
- **Plain object** → `JSON.stringify` + `Content-Type: application/json`
- **`FormData`** → sent as-is, `Content-Type` left to the runtime so the boundary is preserved
- **`string` / `ArrayBuffer` / `null`** → sent as-is

---

## Defining a feature's API surface

Network calls go inside the feature, in `api/<resource>.api.ts`. One file per
backend resource. Export typed functions, not classes. The function signature
*is* the contract: input arguments and output type.

```ts
// src/features/profile/api/profile.api.ts
import { api, API_ENDPOINTS } from '@/shared/api';

export type ProfileDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
};

export type UpdateProfileInput = Partial<
  Pick<ProfileDto, 'firstName' | 'lastName' | 'email'>
>;

export function getMyProfile(signal?: AbortSignal) {
  return api.get<ProfileDto>(API_ENDPOINTS.profile.me, { signal });
}

export function updateMyProfile(patch: UpdateProfileInput) {
  return api.patch<ProfileDto>(API_ENDPOINTS.profile.me, patch);
}
```

A component, hook, or service then imports the function and calls it.
Components should never see `api.get` directly — wrap it in a typed function
first.

---

## Recipes

### 1. Load data on screen mount

The "happy path" pattern. Track loading, data, and error in `useState`. Use an
`AbortController` so a stale response after unmount can't write to state.

```tsx
import { useEffect, useState } from 'react';

import { getMyProfile, type ProfileDto } from '@/features/profile/api/profile.api';
import { ApiAuthenticationError, ApiNetworkError, ApiTimeoutError } from '@/shared/api';

export function useMyProfile() {
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');

    getMyProfile(controller.signal)
      .then((data) => {
        setProfile(data);
        setStatus('success');
      })
      .catch((error) => {
        if (error?.name === 'AbortError') return; // unmounted — ignore
        if (error instanceof ApiAuthenticationError) {
          setErrorMessage('Please sign in again.');
        } else if (error instanceof ApiTimeoutError) {
          setErrorMessage('Took too long. Try again.');
        } else if (error instanceof ApiNetworkError) {
          setErrorMessage('You appear to be offline.');
        } else {
          setErrorMessage('Could not load your profile.');
        }
        setStatus('error');
      });

    return () => controller.abort();
  }, []);

  return { profile, status, errorMessage };
}
```

### 2. List with pagination

Paginated GET. Pass query params via a path helper or a `URLSearchParams` string.

```ts
// src/features/redemption/api/redemption.api.ts
import { api, API_ENDPOINTS } from '@/shared/api';

export type RedemptionDto = {
  id: string;
  posterId: string;
  redeemedAt: string;
};

export type RedemptionPage = {
  items: RedemptionDto[];
  nextCursor: string | null;
};

export function listRedemptions(params: { cursor?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params.cursor) search.set('cursor', params.cursor);
  if (params.limit) search.set('limit', String(params.limit));

  const query = search.toString();
  const path = query
    ? `${API_ENDPOINTS.redemption.list}?${query}`
    : API_ENDPOINTS.redemption.list;

  return api.get<RedemptionPage>(path);
}
```

```tsx
// inside a screen
const [items, setItems] = useState<RedemptionDto[]>([]);
const [cursor, setCursor] = useState<string | null>(null);
const [isLoadingMore, setIsLoadingMore] = useState(false);

const loadMore = useCallback(async () => {
  if (isLoadingMore) return;
  setIsLoadingMore(true);
  try {
    const page = await listRedemptions({ cursor: cursor ?? undefined, limit: 20 });
    setItems((previous) => [...previous, ...page.items]);
    setCursor(page.nextCursor);
  } finally {
    setIsLoadingMore(false);
  }
}, [cursor, isLoadingMore]);
```

### 3. Submit a form (create)

Disable the submit button while the request is in flight. Read typed errors to
show inline field errors when the server rejects.

```ts
// src/features/redemption/api/redemption.api.ts
export type CreateRedemptionInput = { posterId: string; code: string };

export function createRedemption(input: CreateRedemptionInput) {
  return api.post<RedemptionDto>(API_ENDPOINTS.redemption.create, input);
}
```

```tsx
import { ApiRequestError } from '@/shared/api';
import { createRedemption } from '@/features/redemption/api/redemption.api';

export function useRedeemPoster() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (input: CreateRedemptionInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const redemption = await createRedemption(input);
      return redemption;
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 409) {
        setError('This code has already been redeemed.');
      } else if (err instanceof ApiRequestError && err.status === 422) {
        setError('That code looks invalid.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submit, isSubmitting, error };
}
```

### 4. Partial update (PATCH)

```ts
import { updateMyProfile } from '@/features/profile/api/profile.api';

async function saveDisplayName(firstName: string, lastName: string) {
  const updated = await updateMyProfile({ firstName, lastName });
  // push the result into the store (do NOT call api.* from a store action)
  syncProfileState(updated);
}
```

### 5. Delete with confirmation

```tsx
import { Alert } from 'react-native';

import { api, API_ENDPOINTS } from '@/shared/api';

function confirmAndDeleteRedemption(id: string, onDeleted: () => void) {
  Alert.alert('Delete redemption?', 'This cannot be undone.', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete',
      style: 'destructive',
      onPress: async () => {
        await api.delete(API_ENDPOINTS.redemption.byId(id));
        onDeleted();
      },
    },
  ]);
}
```

### 6. Upload an image (`FormData`)

The expo-image-picker result can be sent straight as a `FormData` part. Do NOT
set `Content-Type` yourself — the runtime needs to attach the boundary.

```ts
// src/features/profile/api/profile.api.ts
export function uploadAvatar(localUri: string) {
  const form = new FormData();
  form.append('avatar', {
    uri: localUri,
    name: 'avatar.jpg',
    type: 'image/jpeg',
    // RN's FormData accepts this shape — TS may need a cast
  } as unknown as Blob);

  return api.post<ProfileDto>(API_ENDPOINTS.profile.avatar, form, {
    // larger files need a longer timeout
    timeoutMs: 60_000,
  });
}
```

### 7. Cancel an in-flight request

Tie the request to the component lifecycle. If the user navigates away, the
response never lands in `setState`.

```tsx
useEffect(() => {
  const controller = new AbortController();

  api.get<ProfileDto>(API_ENDPOINTS.profile.me, { signal: controller.signal })
    .then(setProfile)
    .catch((error) => {
      if (error?.name === 'AbortError') return; // unmounted — ignore
      handleError(error);
    });

  return () => controller.abort();
}, []);
```

The default 15s timeout still applies; your `signal` is OR'd with it.

### 8. Calling a public endpoint (no auth)

Pass `requiresAuth: false`. The client will NOT attach a Bearer token and will
not try to refresh on 401.

```ts
// src/features/auth/api/auth.api.ts
import { api, API_ENDPOINTS } from '@/shared/api';

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export function loginRequest(email: string, password: string) {
  return api.post<LoginResponse>(
    API_ENDPOINTS.auth.login,
    { email, password },
    { requiresAuth: false },
  );
}
```

### 9. Calling api functions from a Zustand action

Stores hold state, not side effects. Call the api function from the place that
triggers it (component or service), then push the result into the store via an
action.

```ts
// src/features/profile/services/profile.ts
import { getMyProfile, updateMyProfile, type UpdateProfileInput } from '@/features/profile/api/profile.api';
import { syncProfileState } from '@/store/profile.store';

export async function refreshProfile() {
  const profile = await getMyProfile();
  syncProfileState(profile);
  return profile;
}

export async function saveProfile(patch: UpdateProfileInput) {
  const profile = await updateMyProfile(patch);
  syncProfileState(profile);
  return profile;
}
```

---

## Authentication

Auth is automatic. The client calls `authService.getValidAccessToken()` before
every request that has `requiresAuth: true` (the default). If the response is
`401`, the client calls `authService.forceRefresh()` and retries once. Refresh
is deduped at the service level, so 20 parallel 401s trigger one refresh.

If the refresh fails or no session exists, the client throws
`ApiAuthenticationError`. Catch it at the screen level and route the user back
to login.

You do **not** attach the `Authorization` header yourself.

---

## Errors

```ts
import {
  ApiAuthenticationError,
  ApiNetworkError,
  ApiRequestError,
  ApiTimeoutError,
} from '@/shared/api';

try {
  await updateMyProfile(patch);
} catch (error) {
  if (error instanceof ApiAuthenticationError) {
    // session is gone — send the user to login
  } else if (error instanceof ApiTimeoutError) {
    // show "try again" UI
  } else if (error instanceof ApiNetworkError) {
    // device offline / DNS failure / TLS error
  } else if (error instanceof ApiRequestError) {
    // 4xx/5xx — error.status and error.body are populated
    if (error.status === 409) showConflictBanner();
  } else {
    throw error;
  }
}
```

Branch on `instanceof`. Do NOT parse `error.message` — those strings are for
logs, not control flow.

---

## Endpoint registry

Add new paths to `src/shared/api/endpoints.ts`, grouped by feature:

```ts
export const API_ENDPOINTS = {
  redemption: {
    list: '/redemptions',
    create: '/redemptions',
    byId: (id: string) => `/redemptions/${id}`,
  },
} as const;
```

Why centralize:
- One grep to find every call site for a path.
- One edit when an endpoint moves.
- Cannot typo a URL — TypeScript autocompletes the registry.

---

## Prefetching (advanced)

Nitro Fetch can warm a request before you need its result. Useful when you know
the user is about to navigate to a screen:

```ts
import { prefetch } from 'react-native-nitro-fetch';
import { API_ENDPOINTS, API_CONFIG } from '@/shared/api';

// Right before navigating to the profile screen
await prefetch(`${API_CONFIG.baseUrl}${API_ENDPOINTS.profile.me}`, {
  headers: { prefetchKey: 'profile-me' },
});
```

When the screen loads and calls `api.get(...)` with the same `prefetchKey`
header, the cached response is returned immediately.

Prefetching is fine to use directly from `react-native-nitro-fetch` — it does
not go through the auth layer, so only use it for endpoints that either don't
require auth, or where you can pass the current token explicitly.

---

## DO

- ✅ **Put new endpoints in `API_ENDPOINTS`** and reference them by name.
- ✅ **Create a `<resource>.api.ts` per backend resource** inside the feature.
- ✅ **Type the response.** `api.get<ProfileDto>(...)` — never leave it as `unknown`.
- ✅ **Pass an `AbortSignal`** when the call is tied to a component or screen.
- ✅ **Catch errors by `instanceof`** at the screen boundary and translate to UI.
- ✅ **Keep auth automatic.** Trust `requiresAuth` and the 401 retry. They work.
- ✅ **Validate untrusted response bodies with Zod** if the backend is not under
  our control or the shape matters for safety.

## DON'T

- ❌ **Don't import `react-native-nitro-fetch` outside `src/shared/api/`.** The
  exception is `prefetch` / `prefetchOnAppStart` for warm-up.
- ❌ **Don't use the global `fetch`.** It bypasses Cronet/URLSession and we lose
  HTTP/2, HTTP/3, and the disk cache.
- ❌ **Don't install `axios`, `ky`, or another HTTP wrapper.** The `api` helpers
  cover what those libraries give you, and they would force traffic back through
  XHR (axios) or skip nitro's transport.
- ❌ **Don't set the `Authorization` header manually.** The client does it.
  Manual headers are how stale tokens get sent.
- ❌ **Don't catch errors only to swallow them.** If you can't recover, rethrow
  so the screen-level boundary can show a message.
- ❌ **Don't call `api.get` / `api.post` directly from a component.** Wrap it in
  a typed `*.api.ts` function so the component sees a domain operation, not an
  HTTP detail.
- ❌ **Don't hardcode URLs** — even one-off ones. Add them to `API_ENDPOINTS`.
- ❌ **Don't bypass the timeout** unless the endpoint streams or the caller
  controls cancellation some other way. Long-running requests without a timeout
  are how apps look hung.
- ❌ **Don't put network logic in a Zustand store.** Stores hold state, not
  side effects. Call the api function, then push the result into the store via
  an action.

---

## Testing

The api modules are plain async functions, so mock them per-test:

```ts
jest.mock('@/features/profile/api/profile.api', () => ({
  getMyProfile: jest.fn().mockResolvedValue({
    id: '1', firstName: 'A', lastName: 'B', email: 'a@b.c', avatarUrl: null,
  }),
}));
```

Do not mock `api.get` / `api.post` — mock the feature-level function. That
keeps tests insulated from the transport layer and lets you change the client
without touching every test.
