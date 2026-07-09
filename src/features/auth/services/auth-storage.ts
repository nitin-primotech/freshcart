import * as SecureStore from "expo-secure-store";

import type { AuthSession } from "@/features/auth/types/auth.types";

const SESSION_KEY = "freshcart.auth.session";
const SESSION_TTL_MS = 10 * 60 * 1000;

export async function getStoredSession(): Promise<AuthSession | null> {
	let raw: string | null = null;
	if (process.env.EXPO_OS === "web") {
		try {
			raw = localStorage.getItem(SESSION_KEY);
		} catch {
			// ignore
		}
	} else {
		raw = await SecureStore.getItemAsync(SESSION_KEY);
	}
	if (!raw) return null;
	try {
		return JSON.parse(raw) as AuthSession;
	} catch {
		return null;
	}
}

export function isSessionValid(
	session: AuthSession | null,
): session is AuthSession {
	if (!session?.token || !session.phone) return false;
	return session.expiresAt > Date.now();
}

export async function saveSession(session: AuthSession): Promise<void> {
	if (process.env.EXPO_OS === "web") {
		try {
			localStorage.setItem(SESSION_KEY, JSON.stringify(session));
		} catch {
			// ignore
		}
	} else {
		await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
	}
}

export async function clearStoredSession(): Promise<void> {
	if (process.env.EXPO_OS === "web") {
		try {
			localStorage.removeItem(SESSION_KEY);
		} catch {
			// ignore
		}
	} else {
		await SecureStore.deleteItemAsync(SESSION_KEY);
	}
}

export function createPhoneSession(phoneDigits: string): AuthSession {
	return {
		token: `demo-${phoneDigits}`,
		phone: `+91${phoneDigits}`,
		expiresAt: Date.now() + SESSION_TTL_MS,
	};
}
