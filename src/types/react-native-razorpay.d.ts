declare module "react-native-razorpay" {
	export type RazorpayOptions = {
		key: string;
		amount: number | string;
		currency?: string;
		name?: string;
		description?: string;
		image?: string;
		order_id?: string;
		prefill?: {
			name?: string;
			email?: string;
			contact?: string;
		};
		notes?: Record<string, string>;
		theme?: {
			color?: string;
			hide_topbar?: boolean;
		};
		config?: {
			display?: {
				blocks?: Record<
					string,
					{
						name: string;
						instruments: Array<Record<string, unknown>>;
					}
				>;
				sequence?: string[];
				hide?: Array<{ method: string }>;
				preferences?: {
					show_default_blocks?: boolean;
				};
			};
		};
		method?: "card" | "netbanking" | "wallet" | "upi" | "emi";
		[key: string]: unknown;
	};

	export type PaymentSuccessData = {
		razorpay_payment_id: string;
		razorpay_order_id?: string;
		razorpay_signature?: string;
	};

	export type PaymentErrorData = {
		code: number;
		description: string;
		source?: string;
		step?: string;
		reason?: string;
		metadata?: Record<string, unknown>;
	};

	const RazorpayCheckout: {
		open(options: RazorpayOptions): Promise<PaymentSuccessData>;
	};

	export default RazorpayCheckout;
}
