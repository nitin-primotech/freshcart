import type { Href } from "expo-router";

export function productDetailPath(restaurantId: string, itemId: string): Href {
	return `/product/${restaurantId}/${itemId}` as Href;
}
