export type AuthSession = {
	token: string;
	phone: string;
	expiresAt: number;
};

export type AuthHydrationStatus = "loading" | "ready";
