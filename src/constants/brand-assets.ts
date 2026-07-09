import type { ImageSource } from "expo-image";

/** App icon — green basket. */
export const APP_LOGO = require("@/assets/images/app-icon.png") as ImageSource;

/** Leaf + FreshCart wordmark (user asset). */
export const FRESHCART_LOGO =
	require("@/assets/images/freshcart.png") as ImageSource;

export const LOGIN_HERO =
	require("@/assets/images/Login-hero.png") as ImageSource;

export const ONBOARDING_SLIDES = [
	require("@/assets/images/Onboarding-slide1.png"),
	require("@/assets/images/Onboarding-slide2.png"),
	require("@/assets/images/Onboarding-slide3.png"),
] as const;
