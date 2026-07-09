import type { MenuItem } from "@/features/catalog/types/catalog.types";

export const PRODUCT_TRUST_ITEMS = [
	{ icon: "leaf.fill", label: "100% Fresh" },
	{ icon: "shield.fill", label: "No Preservatives" },
	{ icon: "sparkles", label: "Naturally Grown" },
	{ icon: "heart.fill", label: "Rich in Vitamin C" },
] as const;

export type ProductReview = {
	id: string;
	name: string;
	rating: number;
	text: string;
	daysAgo: number;
	verified: boolean;
};

export const PRODUCT_REVIEWS_PREVIEW_COUNT = 2;

export const MOCK_PRODUCT_REVIEWS: ProductReview[] = [
	{
		id: "rev-1",
		name: "Rahul Sharma",
		rating: 5,
		text: "Fresh, tasty and delivered on time. Will order again.",
		daysAgo: 2,
		verified: true,
	},
	{
		id: "rev-2",
		name: "Priya Nair",
		rating: 4,
		text: "Good portion size and packaging was neat.",
		daysAgo: 5,
		verified: true,
	},
	{
		id: "rev-3",
		name: "Amit Verma",
		rating: 5,
		text: "Exactly what I expected — hot, flavourful and well packed.",
		daysAgo: 8,
		verified: true,
	},
	{
		id: "rev-4",
		name: "Sneha Kapoor",
		rating: 4,
		text: "Loved the taste. Delivery was quick and the rider was polite.",
		daysAgo: 11,
		verified: true,
	},
	{
		id: "rev-5",
		name: "Karan Mehta",
		rating: 5,
		text: "One of the better orders I have placed on foodRush. Highly recommend.",
		daysAgo: 14,
		verified: false,
	},
	{
		id: "rev-6",
		name: "Divya Joshi",
		rating: 3,
		text: "Taste was good but portion felt slightly smaller than expected.",
		daysAgo: 18,
		verified: true,
	},
	{
		id: "rev-7",
		name: "Vikram Singh",
		rating: 5,
		text: "Perfect for a quick lunch. Arrived warm and the spices were spot on.",
		daysAgo: 21,
		verified: true,
	},
	{
		id: "rev-8",
		name: "Ananya Reddy",
		rating: 4,
		text: "Reliable quality every time from this kitchen. Good value for money.",
		daysAgo: 26,
		verified: true,
	},
];

export function getProductTagline(item: MenuItem): string {
	const desc = item.description?.trim();
	if (!desc) return "Handpicked for freshness and quality";

	const parts = desc.split("·").map((part) => part.trim());
	if (parts.length > 1) {
		const tagline = parts.slice(1).join(", ");
		return tagline.charAt(0).toUpperCase() + tagline.slice(1);
	}

	if (/^\d/.test(desc)) return "Handpicked for freshness and quality";
	return desc;
}

export function getProductDetailBullets(item: MenuItem): string[] {
	if (item.description) {
		return [
			item.description,
			"Handpicked and quality checked before dispatch",
			"Packed in food-safe containers",
		];
	}

	const bullets = [
		item.isVegetarian ? "100% vegetarian" : "Freshly sourced for quality",
		item.calories
			? `Approx. ${item.calories} cal per serving`
			: "Farm-fresh quality",
		"Packed in food-safe containers",
	];

	if (item.isPopular) {
		bullets.unshift("Top pick among customers");
	}

	return bullets;
}

export function formatServingLabel(item: MenuItem): string {
	if (item.description) return item.description;
	if (item.calories) return `1 serving · ${item.calories} cal`;
	return "1 serving";
}

export function formatDeliveryEta(min: number, max: number): string {
	if (min === max) return `${min} min`;
	return `${min}–${max} min`;
}
