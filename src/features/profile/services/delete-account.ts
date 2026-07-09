import { resetAppProfile } from "@/store/app.store";
import { clearAuthState } from "@/store/auth.store";
import { clearCart } from "@/store/cart.store";
import { resetOrders } from "@/store/orders.store";
import { clearWishlist } from "@/store/wishlist.store";

export async function deleteUserAccount() {
	resetOrders();
	clearCart();
	clearWishlist();
	await clearAuthState();
	await resetAppProfile();
}
