import type { ImageSource } from "expo-image";

export type PaymentBrandLogo = {
	id: string;
	name: string;
	image?: ImageSource;
	symbol?: string;
};

export const PAYMENT_BRAND_LOGOS = {
	applePay: {
		id: "apple-pay",
		name: "Apple Pay",
		symbol: "apple.logo",
	},
	gpay: {
		id: "gpay",
		name: "Google Pay",
		image: require("@/assets/images/payments/gpay.png"),
	},
	paypal: {
		id: "paypal",
		name: "PayPal",
		symbol: "dollarsign.circle.fill",
	},
	visa: {
		id: "visa",
		name: "Visa",
		image: require("@/assets/images/payments/visa.png"),
	},
	mastercard: {
		id: "mastercard",
		name: "Mastercard",
		image: require("@/assets/images/payments/mastercard.png"),
	},
	amex: {
		id: "amex",
		name: "American Express",
		symbol: "creditcard.fill",
	},
	discover: {
		id: "discover",
		name: "Discover",
		symbol: "creditcard.circle.fill",
	},
	klarna: {
		id: "klarna",
		name: "Klarna",
		symbol: "calendar.badge.clock",
	},
	afterpay: {
		id: "afterpay",
		name: "Afterpay",
		symbol: "clock.arrow.2.circlepath",
	},
} as const satisfies Record<string, PaymentBrandLogo>;
