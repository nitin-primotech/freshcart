/**
 * Shared HTTP client — all network traffic goes through this module.
 * See docs/api-and-networking.md for patterns and recipes.
 */

export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000',
  timeoutMs: Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? 15_000),
} as const;

export const API_ENDPOINTS = {} as const;
