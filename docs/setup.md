# Setup & Running

## Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Xcode](https://developer.apple.com/xcode/) (iOS)
- [Android Studio](https://developer.android.com/studio) + emulator (Android)
- Node >= 18

## Install

```bash
bun install
```

## Run

```bash
# iOS — prebuild native project then launch on simulator
bun ios

# Android — prebuild native project then launch on emulator
bun android

# Web
bun web
```

> Both `bun ios` and `bun android` run `expo prebuild` first, which generates the native `ios/` and `android/` folders. These are gitignored — always build from source.

## Code Quality

```bash
# Format + lint in one pass (recommended)
bun check

# Lint only
bun lint

# Format only
bun format
```

## Environment Variables

Place environment variables in `.env.local` at the project root. Expo exposes variables prefixed with `EXPO_PUBLIC_` to the JS bundle.

```
EXPO_PUBLIC_API_URL=https://api.example.com
```

Access in code:

```ts
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

Never commit `.env.local`. It is gitignored.
