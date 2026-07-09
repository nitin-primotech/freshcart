import type { Href } from "expo-router";

export type DietLifestyleItem = {
	id: string;
	name: string;
	icon: string;
	href: Href;
};

export type TopCategoryBanner = {
	id: string;
	title: string;
	subtitle: string;
	backgroundColor: string;
	accentColor: string;
	image: string;
	href: Href;
};

export const DIET_LIFESTYLE_ITEMS: DietLifestyleItem[] = [
	{
		id: "diet-gluten-free",
		name: "Gluten Free",
		icon: "leaf.fill",
		href: "/category/cat-gluten-free",
	},
	{
		id: "diet-organic",
		name: "Organic",
		icon: "sparkles",
		href: "/category/cat-organic",
	},
	{
		id: "diet-vegan",
		name: "Vegan",
		icon: "leaf.fill",
		href: "/category/cat-fruits-veg",
	},
	{
		id: "diet-keto",
		name: "Keto",
		icon: "flame.fill",
		href: "/category/cat-meat-seafood",
	},
	{
		id: "diet-low-carb",
		name: "Low Carb",
		icon: "bolt.fill",
		href: "/category/cat-dairy-eggs",
	},
	{
		id: "diet-no-sugar",
		name: "No Sugar Added",
		icon: "cup.and.saucer.fill",
		href: "/category/cat-beverages",
	},
];

export const TOP_CATEGORY_BANNERS: TopCategoryBanner[] = [
	{
		id: "banner-summer",
		title: "Summer Essentials",
		subtitle: "Stay cool this summer",
		backgroundColor: "#E3F2FD",
		accentColor: "#1565C0",
		image: "https://pngimg.com/uploads/orange_juice/orange_juice_PNG7.png",
		href: "/category/cat-beverages",
	},
	{
		id: "banner-bbq",
		title: "BBQ Party Must-Haves",
		subtitle: "Everything for your BBQ",
		backgroundColor: "#FFF3E0",
		accentColor: "#E65100",
		image: "https://pngimg.com/uploads/meat/meat_PNG13111.png",
		href: "/category/cat-meat-seafood",
	},
	{
		id: "banner-school",
		title: "Back to School",
		subtitle: "Snacks, lunch & more",
		backgroundColor: "#F3E5F5",
		accentColor: "#6A1B9A",
		image: "https://pngimg.com/uploads/potato_chips/potato_chips_PNG6.png",
		href: "/category/cat-snacks",
	},
];
