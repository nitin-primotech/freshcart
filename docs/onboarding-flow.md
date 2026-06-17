# foodRush — Onboarding Flow

Industry-style onboarding from launch through personalization.

## Flow order

```
Splash → Welcome → Phone → OTP → Name → Location → Personalize → Home
```

Location runs **after** phone login (post-auth), same as the original foodRush pattern.

## Routes

| Step | Route | Auth required |
|---|---|---|
| Splash | `/` (branded, then redirect) | No |
| Welcome | `/(auth)/welcome` | No |
| Phone | `/(auth)/phone` | No |
| OTP | `/(auth)/verify` | No |
| Name | `/(auth)/name` | Yes |
| Location | `/location?onboarding=1` | Yes |
| Personalize | `/(auth)/personalize` | Yes |
| Home | `/(tabs)` | Yes |

Change address from home: `/location` (no query param).

## State (`app.store` + SecureStore)

| Field | Purpose |
|---|---|
| `onboardingStep` | Resume after app kill |
| `hasConfirmedAddress` | Location completed during onboarding |
| `onboardingComplete` | Ready for tabs |
| `preferences` | `cuisineIds`, `dietary`, `skipped` |

## Resume logic

`getOnboardingHref()` in `src/features/auth/utils/onboarding-route.ts` powers `/` and tabs guard.

## Demo notes

- OTP demo code: **1234**
- Location uses mock suggestions + “Use current location” on search screen
- Personalization skip is first-class; home still works with generic ranking
