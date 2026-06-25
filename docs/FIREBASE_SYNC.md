# Firebase sync — Customer app ↔ Merchant app

The customer app (`food-delivery-app`) and merchant app (`delivrn_merchant`) share the **same Firebase project** (`foodrush-1c40b`).

## Setup

1. Copy Firebase web config from Firebase Console → Project settings → Your apps.
2. Create `.env` in the customer app root:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=foodrush-1c40b.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=foodrush-1c40b
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=foodrush-1c40b.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. Restart Expo: `bun start --clear`
4. In the merchant app, run `bun run reseed:inventory` if `inventory` is empty.

## What syncs

| Data | Firestore collection | Customer app | Merchant app |
|------|---------------------|--------------|--------------|
| Menu items | `inventory` | Home, restaurant, product screens | Menu editor |
| Categories | derived from `inventory.category` | Category strip & filters | Menu categories |
| Orders | `orders` | Place order, orders tab, tracking | Orders dashboard |

## Auth note

- **Customer app** still uses demo phone OTP (`1234`) locally.
- Orders are linked by **phone number** (`customerPhone` on the order doc).
- **Merchant app** uses Firebase Email/Password auth.

For production, replace demo OTP with **Firebase Phone Auth** so `customerId` = Firebase UID.

## Order status mapping

| Merchant (Firestore) | Customer app UI |
|---------------------|-----------------|
| `placed` | confirmed |
| `preparing` | preparing |
| `ready_for_pickup` | preparing |
| `dispatched` | on_the_way |
| `delivered` | delivered |
| `rejected` | cancelled |

## Troubleshooting

### Still seeing mock restaurants (Ember & Oak, Sora Sushi)?

- `.env` must exist with `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- Restart Expo with cache clear: `bun start --clear`
- Home should show **FoodRush Kitchen** when Firebase is connected

### Orders not appearing on merchant dashboard (localhost:3000)?

1. Confirm both apps use project `foodrush-1c40b`
2. In dev mode, Razorpay is **skipped** when Firebase is configured — order goes straight to Firestore
3. Merchant dashboard must be logged in and on the Orders tab
4. Customer must be logged in with phone number (orders filter by `customerPhone`)
