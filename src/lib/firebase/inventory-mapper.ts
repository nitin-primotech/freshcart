import type {
	Category,
	MenuSection,
	Restaurant,
} from "@/features/catalog/types/catalog.types";
import {
	buildCategoryImageMap,
	deriveRestaurantProfileImages,
	mapMenuItemFromFirestore,
} from "@/lib/firebase/catalog-images";
import type { FirestoreMenuItem } from "@/lib/firebase/types";

export const DEFAULT_MERCHANT_RESTAURANT_ID = "freshcart";

const DEFAULT_RESTAURANT_PROFILE: Omit<Restaurant, "categoryIds" | "menu"> = {
	id: DEFAULT_MERCHANT_RESTAURANT_ID,
	name: "FoodRush Kitchen",
	tagline: "Fresh food, fast delivery",
	cuisine: "Punjabi · North Indian · Tandoor",
	rating: 4.7,
	reviewCount: 520,
	deliveryTimeMin: 25,
	deliveryTimeMax: 40,
	deliveryFee: 29,
	distanceKm: 2.1,
	isFreeDelivery: false,
	isPromoted: true,
	offerLabel: "Free delivery on orders above ₹299",
	isFastDelivery: true,
	coverImage: "",
	logoImage: "",
};

function slugify(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

export function mapFirestoreMenuItem(
	item: FirestoreMenuItem,
	categoryImageByName: Map<string, string>,
) {
	return mapMenuItemFromFirestore(item, categoryImageByName);
}

function mapInventoryToCategoriesFromMap(
	categoryImageByName: Map<string, string>,
): Category[] {
	const names = [...categoryImageByName.keys()].sort();

	return names.map((name) => ({
		id: `cat-${slugify(name)}`,
		name,
		icon: "🍽️",
		image: categoryImageByName.get(name) ?? "",
	}));
}

export function mapInventoryToCategories(
	items: FirestoreMenuItem[],
): Category[] {
	return mapInventoryToCategoriesFromMap(buildCategoryImageMap(items));
}

export function mapInventoryToRestaurant(
	items: FirestoreMenuItem[],
): Restaurant {
	const categoryImageByName = buildCategoryImageMap(items);
	const categories = mapInventoryToCategoriesFromMap(categoryImageByName);
	const profileImages = deriveRestaurantProfileImages(items);
	const grouped = new Map<string, FirestoreMenuItem[]>();

	for (const item of items) {
		const sectionTitle = item.subcategory?.trim() || item.category;
		const bucket = grouped.get(sectionTitle) ?? [];
		bucket.push(item);
		grouped.set(sectionTitle, bucket);
	}

	const menu: MenuSection[] = [...grouped.entries()].map(
		([title, sectionItems]) => ({
			id: `sec-${slugify(title)}`,
			title,
			items: sectionItems
				.filter((item) => item.inStock)
				.map((item) => mapMenuItemFromFirestore(item, categoryImageByName)),
		}),
	);

	return {
		...DEFAULT_RESTAURANT_PROFILE,
		coverImage: profileImages.coverImage,
		logoImage: profileImages.logoImage,
		categoryIds: categories.map((category) => category.id),
		menu: menu.filter((section) => section.items.length > 0),
	};
}
