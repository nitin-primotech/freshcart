import type { PaymentBrandLogo } from "@/features/checkout/constants/payment-brands";
import { PAYMENT_BRAND_LOGOS } from "@/features/checkout/constants/payment-brands";

export type CheckoutAddress = {
	id: string;
	label: string;
	line1: string;
	line2: string;
};

export type PaymentMethodOption = {
	id: string;
	label: string;
	subtitle?: string;
	badge?: string;
	trailingLogos?: PaymentBrandLogo[];
	trailingSymbol?: string;
	showChevron?: boolean;
};

export type SavedCard = {
	id: string;
	brand: "visa" | "mastercard" | "amex" | "discover";
	last4: string;
	expiry: string;
	isDefault?: boolean;
};

export const CHECKOUT_OFFICE_ADDRESS: CheckoutAddress = {
	id: "home",
	label: "Home",
	line1: "221B Baker Street",
	line2: "New York, NY 10001",
};

export const FREE_DELIVERY_THRESHOLD = 35;
export const DELIVERY_FEE = 2.99;
export const PLATFORM_FEE = 1.53;
export const TAX_RATE = 0.08875;

export const PAYMENT_METHODS: PaymentMethodOption[] = [
	{
		id: "apple-pay",
		label: "Apple Pay",
		badge: "Fast & Secure",
		trailingSymbol: "wave.3.right",
	},
	{
		id: "google-pay",
		label: "Google Pay",
		badge: "Fast & Secure",
		trailingLogos: [PAYMENT_BRAND_LOGOS.gpay],
	},
	{
		id: "paypal",
		label: "PayPal",
		showChevron: true,
		trailingLogos: [PAYMENT_BRAND_LOGOS.paypal],
	},
	{
		id: "card",
		label: "Credit / Debit Card",
		trailingLogos: [
			PAYMENT_BRAND_LOGOS.visa,
			PAYMENT_BRAND_LOGOS.mastercard,
			PAYMENT_BRAND_LOGOS.amex,
			PAYMENT_BRAND_LOGOS.discover,
		],
	},
	{
		id: "klarna",
		label: "Klarna",
		subtitle: "Buy now, pay later",
		trailingLogos: [PAYMENT_BRAND_LOGOS.klarna],
	},
	{
		id: "afterpay",
		label: "Afterpay",
		subtitle: "Buy now, pay later",
		trailingLogos: [PAYMENT_BRAND_LOGOS.afterpay],
	},
];

export const SAVED_CARDS: SavedCard[] = [
	{
		id: "card-1",
		brand: "visa",
		last4: "4242",
		expiry: "08/27",
		isDefault: true,
	},
	{
		id: "card-2",
		brand: "mastercard",
		last4: "8888",
		expiry: "11/26",
	},
];

export function computeOfferDiscount(
	code: string,
	subtotal: number,
): { discount: number; freeDelivery: boolean } {
	switch (code) {
		case "WELCOME20":
			return { discount: Math.min(subtotal * 0.2, 15), freeDelivery: false };
		case "FREEDEL":
			return { discount: 0, freeDelivery: true };
		default:
			return { discount: 0, freeDelivery: false };
	}
}
