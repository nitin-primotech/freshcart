import type { OrderStatus } from "@/features/catalog/types/catalog.types";

export type OrderTabId =
	| "all"
	| "ongoing"
	| "completed"
	| "cancelled"
	| "returned";

export type OrderTab = {
	id: OrderTabId;
	label: string;
	icon: string;
};

export const ORDER_TABS: OrderTab[] = [
	{ id: "all", label: "All Orders", icon: "bag.fill" },
	{ id: "ongoing", label: "Ongoing", icon: "clock" },
	{ id: "completed", label: "Completed", icon: "checkmark.circle.fill" },
	{ id: "cancelled", label: "Cancelled", icon: "xmark.circle.fill" },
	{ id: "returned", label: "Returned", icon: "arrow.2.circlepath" },
];

export type OrderStatusUi = {
	label: string;
	icon: string;
	color: string;
	bg: string;
};

export const ORDER_STATUS_UI: Record<OrderStatus, OrderStatusUi> = {
	confirmed: {
		label: "Processing",
		icon: "clock",
		color: "#2D8B3F",
		bg: "#E8F5E9",
	},
	preparing: {
		label: "Processing",
		icon: "clock",
		color: "#2D8B3F",
		bg: "#E8F5E9",
	},
	ready: {
		label: "Ready to Ship",
		icon: "shippingbox.fill",
		color: "#2D8B3F",
		bg: "#E8F5E9",
	},
	on_the_way: {
		label: "Out for Delivery",
		icon: "bicycle",
		color: "#2D8B3F",
		bg: "#E8F5E9",
	},
	delivered: {
		label: "Delivered",
		icon: "checkmark.circle.fill",
		color: "#2D8B3F",
		bg: "#E8F5E9",
	},
	cancelled: {
		label: "Cancelled",
		icon: "exclamationmark.circle.fill",
		color: "#DC2626",
		bg: "#FEE2E2",
	},
};

export function formatOrderId(orderId: string): string {
	const compact = orderId.replace(/\D/g, "").slice(-8).padStart(8, "0");
	return `#FC${compact}`;
}

export function formatOrderDateTime(iso: string): string {
	const date = new Date(iso);
	const day = date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
	const time = date.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
	return `${day} • ${time}`;
}

export function formatDeliveryLine(
	status: OrderStatus,
	estimatedDelivery: string,
): string {
	const date = new Date(estimatedDelivery).toLocaleDateString("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	if (status === "delivered") return `Delivered on ${date}`;
	return `Arriving by ${date}`;
}

export function countOrderItems(items: { quantity: number }[]): number {
	return items.reduce((sum, line) => sum + line.quantity, 0);
}

export function formatPlacedOn(iso: string): string {
	const date = new Date(iso);
	return `Placed on ${date.toLocaleString("en-US", {
		day: "numeric",
		month: "short",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	})}`;
}

export function formatEstimatedWindow(
	estimatedDelivery: string,
	options?: {
		prepStartedAt?: string;
		prepTime?: number;
		status?: OrderStatus;
	},
): string {
	const eta = new Date(estimatedDelivery);
	const now = new Date();
	const isToday =
		eta.getDate() === now.getDate() &&
		eta.getMonth() === now.getMonth() &&
		eta.getFullYear() === now.getFullYear();
	const dayLabel = isToday
		? "Today"
		: eta.toLocaleDateString("en-US", { day: "numeric", month: "short" });

	const formatTime = (date: Date) =>
		date.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});

	if (
		options?.status === "preparing" &&
		options.prepStartedAt &&
		options.prepTime
	) {
		const prepEnd = new Date(
			new Date(options.prepStartedAt).getTime() + options.prepTime * 60 * 1000,
		);
		const deliveryStart = prepEnd;
		const deliveryEnd = eta;
		return `${dayLabel}, ${formatTime(deliveryStart)} - ${formatTime(deliveryEnd)}`;
	}

	if (options?.status === "on_the_way") {
		const deliveryEnd = eta;
		const deliveryStart = new Date(eta.getTime() - 60 * 60 * 1000);
		return `${dayLabel}, ${formatTime(deliveryStart)} - ${formatTime(deliveryEnd)}`;
	}

	const start = new Date(eta.getTime() - 15 * 60 * 1000);
	return `${dayLabel}, ${formatTime(start)} - ${formatTime(eta)}`;
}

export function formatMinutesUntil(iso: string): string | null {
	const target = new Date(iso).getTime();
	const diffMins = Math.max(0, Math.round((target - Date.now()) / 60000));
	if (diffMins <= 0) return "Arriving soon";
	return `${diffMins} min`;
}

export type TrackingStepState = "done" | "active" | "pending" | "cancelled";

export const TRACKING_STEPS = [
	{
		key: "confirmed",
		label: "Order Confirmed",
		description: "Your order has been confirmed",
		icon: "checkmark",
	},
	{
		key: "preparing",
		label: "Being Prepared",
		description: "Restaurant is preparing your food",
		icon: "flame.fill",
	},
	{
		key: "packed",
		label: "Packed",
		description: "Your items are packed and ready to ship",
		icon: "shippingbox.fill",
	},
	{
		key: "dispatched",
		label: "Dispatched",
		description: "Order handed to delivery partner",
		icon: "truck.box.fill",
	},
	{
		key: "out_for_delivery",
		label: "Out for Delivery",
		description: "Rider is on the way to you",
		icon: "bicycle",
	},
	{
		key: "delivered",
		label: "Delivered",
		description: "Enjoy your meal!",
		icon: "checkmark.circle.fill",
	},
] as const;

export const CANCELLED_TRACKING_STEP = {
	key: "cancelled",
	label: "Order Cancelled",
	description: "This order was cancelled and will not be delivered",
	icon: "xmark.circle.fill",
} as const;

export const TRACKING_STATUS_BADGE: Record<OrderStatus, OrderStatusUi> =
	ORDER_STATUS_UI;

export function getCancelledProgressIndex(
	timestamps: TrackingTimestamps,
): number {
	if (!timestamps.prepStartedAt) {
		return 0;
	}
	return 1;
}

export function resolveTrackingStepState(
	stepIndex: number,
	status: OrderStatus,
	timestamps?: TrackingTimestamps,
): TrackingStepState {
	if (status === "cancelled") {
		const progress = timestamps ? getCancelledProgressIndex(timestamps) : 0;
		if (stepIndex <= progress) {
			return "done";
		}
		return "pending";
	}
	if (status === "delivered") return "done";

	const activeIndex: Record<OrderStatus, number> = {
		confirmed: 0,
		preparing: 1,
		ready: 2,
		on_the_way: 4,
		delivered: 5,
		cancelled: 0,
	};

	const active = activeIndex[status];

	if (stepIndex < active) return "done";
	if (status === "on_the_way" && stepIndex === 3) return "done";
	if (stepIndex === active) return "active";
	return "pending";
}

export function formatCancelledOn(iso: string): string {
	return new Date(iso).toLocaleString("en-US", {
		day: "numeric",
		month: "short",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

export type TrackingTimestamps = {
	createdAt: string;
	prepStartedAt?: string;
	prepTime?: number;
	updatedAt: string;
};

export function formatTrackingStepTime(
	stepKey:
		| (typeof TRACKING_STEPS)[number]["key"]
		| typeof CANCELLED_TRACKING_STEP.key,
	state: TrackingStepState,
	timestamps: TrackingTimestamps,
): string | null {
	if (state === "pending") return null;

	const format = (iso: string) =>
		new Date(iso).toLocaleString("en-US", {
			day: "numeric",
			month: "short",
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});

	switch (stepKey) {
		case "confirmed":
			return format(timestamps.createdAt);
		case "preparing":
			return timestamps.prepStartedAt
				? format(timestamps.prepStartedAt)
				: format(timestamps.createdAt);
		case "packed":
			if (timestamps.prepStartedAt && timestamps.prepTime) {
				return format(
					new Date(
						new Date(timestamps.prepStartedAt).getTime() +
							timestamps.prepTime * 60 * 1000,
					).toISOString(),
				);
			}
			return timestamps.updatedAt ? format(timestamps.updatedAt) : null;
		case "dispatched":
		case "out_for_delivery":
			return timestamps.updatedAt ? format(timestamps.updatedAt) : null;
		case "delivered":
			return timestamps.updatedAt ? format(timestamps.updatedAt) : null;
		case "cancelled":
			return timestamps.updatedAt ? format(timestamps.updatedAt) : null;
		default:
			return null;
	}
}

export function isOngoingOrder(status: OrderStatus): boolean {
	return (
		status === "confirmed" ||
		status === "preparing" ||
		status === "ready" ||
		status === "on_the_way"
	);
}

export function filterOrdersByTab(
	orders: import("@/features/catalog/types/catalog.types").Order[],
	tab: OrderTabId,
) {
	switch (tab) {
		case "all":
			return orders;
		case "ongoing":
			return orders.filter((order) => isOngoingOrder(order.status));
		case "completed":
			return orders.filter((order) => order.status === "delivered");
		case "cancelled":
			return orders.filter((order) => order.status === "cancelled");
		case "returned":
			return [];
	}
}
