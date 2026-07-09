import { doc, onSnapshot } from "firebase/firestore";

import { getFirestoreDb } from "@/lib/firebase/client";
import { FIRESTORE_COLLECTIONS } from "@/lib/firebase/collections";
import { DEFAULT_MERCHANT_RESTAURANT_ID } from "@/lib/firebase/inventory-mapper";
import type { FirestoreMerchant } from "@/lib/firebase/types";

export function subscribeToMerchant(
	callback: (merchant: FirestoreMerchant) => void,
): () => void {
	const db = getFirestoreDb();
	if (!db) {
		return () => undefined;
	}

	const docRef = doc(
		db,
		FIRESTORE_COLLECTIONS.merchants,
		DEFAULT_MERCHANT_RESTAURANT_ID,
	);

	return onSnapshot(
		docRef,
		(snapshot) => {
			const data = snapshot.data();
			if (!data) {
				return;
			}

			callback({
				id: DEFAULT_MERCHANT_RESTAURANT_ID,
				name: typeof data.name === "string" ? data.name : "FoodRush Kitchen",
				status: data.status === "offline" ? "offline" : "online",
				updatedAt:
					typeof data.updatedAt === "number" ? data.updatedAt : Date.now(),
			});
		},
		(error) => {
			console.error("[Firestore] merchants listener failed.", error);
		},
	);
}
