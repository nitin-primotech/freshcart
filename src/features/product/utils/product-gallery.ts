import type { Restaurant } from "@/features/catalog/types/catalog.types";

import { isHttpImageUrl } from "@/lib/firebase/category-images";

export function getProductGalleryImages(
	primaryImage: string,
	relatedImages: string[],
	limit = 3,
): string[] {
	const gallery: string[] = [];

	if (isHttpImageUrl(primaryImage)) {
		gallery.push(primaryImage);
	}

	for (const image of relatedImages) {
		if (gallery.length >= limit) {
			break;
		}
		if (isHttpImageUrl(image) && !gallery.includes(image)) {
			gallery.push(image);
		}
	}

	return gallery;
}

export function getRelatedProductImageUrls(
	restaurant: Restaurant,
	itemId: string,
	limit = 3,
): string[] {
	const items = restaurant.menu.flatMap((section) => section.items);
	const primary = items.find((item) => item.id === itemId)?.image ?? "";
	const related = items
		.filter((item) => item.id !== itemId)
		.map((item) => item.image);

	return getProductGalleryImages(primary, related, limit);
}

export function getRatingDistribution(
	rating: number,
	reviewCount: number,
): Record<5 | 4 | 3 | 2 | 1, number> {
	const weights = {
		5: Math.max(0.45 + (rating - 4) * 0.35, 0.2),
		4: Math.max(0.28 - (rating - 4) * 0.1, 0.12),
		3: 0.12,
		2: 0.06,
		1: 0.04,
	} as const;

	const totalWeight = Object.values(weights).reduce(
		(sum, value) => sum + value,
		0,
	);

	return {
		5: Math.round((weights[5] / totalWeight) * reviewCount),
		4: Math.round((weights[4] / totalWeight) * reviewCount),
		3: Math.round((weights[3] / totalWeight) * reviewCount),
		2: Math.round((weights[2] / totalWeight) * reviewCount),
		1: Math.max(
			0,
			reviewCount -
				Math.round((weights[5] / totalWeight) * reviewCount) -
				Math.round((weights[4] / totalWeight) * reviewCount) -
				Math.round((weights[3] / totalWeight) * reviewCount) -
				Math.round((weights[2] / totalWeight) * reviewCount),
		),
	};
}
