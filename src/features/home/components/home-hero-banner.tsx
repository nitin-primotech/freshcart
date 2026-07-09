import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	type NativeScrollEvent,
	type NativeSyntheticEvent,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
} from "react-native";

import type { Promo } from "@/features/catalog/types/catalog.types";
import { AppSymbol } from "@/shared/components/app-symbol";
import { colors } from "@/theme/colors";
import { radius, spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

const SLIDE_HEIGHT = 128;
const AUTO_ADVANCE_MS = 4500;

type HomeHeroBannerProps = {
	promos?: Promo[];
};

export function HomeHeroBanner({ promos: _promos }: HomeHeroBannerProps) {
	const router = useRouter();
	const { width } = useWindowDimensions();
	const [activeIndex, setActiveIndex] = useState(0);
	const scrollRef = useRef<ScrollView>(null);
	const activeIndexRef = useRef(0);
	const isUserDraggingRef = useRef(false);
	const autoAdvanceTimerRef = useRef<ReturnType<typeof setInterval> | null>(
		null,
	);

	const items = [0, 1, 2];
	const cardWidth = width - spacing.md * 2;

	const clearAutoAdvance = useCallback(() => {
		if (autoAdvanceTimerRef.current) {
			clearInterval(autoAdvanceTimerRef.current);
			autoAdvanceTimerRef.current = null;
		}
	}, []);

	const scrollToIndex = useCallback(
		(index: number) => {
			const clamped = Math.min(Math.max(index, 0), items.length - 1);
			activeIndexRef.current = clamped;
			setActiveIndex(clamped);
			scrollRef.current?.scrollTo({ x: clamped * width, animated: true });
		},
		[items.length, width],
	);

	const startAutoAdvance = useCallback(() => {
		clearAutoAdvance();
		if (items.length <= 1) return;
		autoAdvanceTimerRef.current = setInterval(() => {
			if (isUserDraggingRef.current) return;
			const next = (activeIndexRef.current + 1) % items.length;
			scrollToIndex(next);
		}, AUTO_ADVANCE_MS);
	}, [clearAutoAdvance, items.length, scrollToIndex]);

	useEffect(() => {
		startAutoAdvance();
		return clearAutoAdvance;
	}, [clearAutoAdvance, startAutoAdvance]);

	function syncIndexFromOffset(offsetX: number) {
		const index = Math.round(offsetX / width);
		activeIndexRef.current = Math.min(Math.max(index, 0), items.length - 1);
		setActiveIndex(activeIndexRef.current);
	}

	function onScrollBeginDrag() {
		isUserDraggingRef.current = true;
		clearAutoAdvance();
	}

	function onScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
		syncIndexFromOffset(e.nativeEvent.contentOffset.x);
		isUserDraggingRef.current = false;
		startAutoAdvance();
	}

	return (
		<View style={styles.wrap}>
			<ScrollView
				ref={scrollRef}
				horizontal
				pagingEnabled
				nestedScrollEnabled
				showsHorizontalScrollIndicator={false}
				decelerationRate="fast"
				onScrollBeginDrag={onScrollBeginDrag}
				onMomentumScrollEnd={onScrollEnd}
				onScrollEndDrag={onScrollEnd}
				style={styles.scroller}
			>
				{items.map((slide) => (
					<View key={`hero-${slide}`} style={[styles.slide, { width }]}>
						<View style={[styles.card, { width: cardWidth }]}>
							<View style={styles.copy}>
								<View style={styles.eyebrow}>
									<AppSymbol
										name="leaf.fill"
										size={9}
										tintColor="#A5D6A7"
										weight="semibold"
									/>
									<Text style={styles.eyebrowText}>FRESH SAVINGS</Text>
								</View>

								<Text style={styles.title}>
									Fresh Groceries{"\n"}Delivered{" "}
									<Text style={styles.titleAccent}>Fast</Text>
								</Text>

								<Text style={styles.subtitle}>
									Get everything you need, delivered in 15–30 mins
								</Text>

								<Pressable
									style={styles.cta}
									onPress={() => router.push("/(tabs)/categories")}
									accessibilityRole="button"
									accessibilityLabel="Shop now"
								>
									<Text style={styles.ctaLabel}>Shop Now</Text>
									<AppSymbol
										name="arrow.right"
										size={11}
										tintColor={colors.primary}
										weight="semibold"
									/>
								</Pressable>
							</View>

							<View style={styles.artwork}>
								<Image
									source={require("@/assets/images/home-hero-basket.png")}
									style={styles.heroImage}
									contentFit="contain"
									transition={200}
								/>
							</View>
						</View>
					</View>
				))}
			</ScrollView>

			<View style={styles.dots}>
				{items.map((slide) => (
					<View
						key={`dot-${slide}`}
						style={[styles.dot, slide === activeIndex && styles.dotActive]}
					/>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		gap: spacing.xs,
	},
	scroller: {
		height: SLIDE_HEIGHT,
	},
	slide: {
		height: SLIDE_HEIGHT,
		alignItems: "center",
		justifyContent: "center",
	},
	card: {
		height: SLIDE_HEIGHT,
		borderRadius: 14,
		borderCurve: "continuous",
		overflow: "hidden",
		flexDirection: "row",
		alignItems: "stretch",
		backgroundColor: "#1B5E20",
	},
	copy: {
		flex: 1,
		paddingLeft: spacing.md,
		paddingVertical: spacing.sm,
		justifyContent: "center",
		gap: 2,
		zIndex: 1,
	},
	eyebrow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 3,
		marginBottom: 2,
	},
	eyebrowText: {
		fontFamily: fonts.semibold,
		fontSize: 8,
		lineHeight: 10,
		color: "#A5D6A7",
		letterSpacing: 0.5,
	},
	title: {
		fontFamily: fonts.bold,
		fontSize: 16,
		lineHeight: 19,
		color: colors.textInverse,
		letterSpacing: -0.2,
	},
	titleAccent: {
		color: "#81C784",
	},
	subtitle: {
		fontFamily: fonts.regular,
		fontSize: 9,
		lineHeight: 12,
		color: "rgba(255,255,255,0.75)",
		marginBottom: spacing.xs,
		marginTop: 2,
	},
	cta: {
		alignSelf: "flex-start",
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		backgroundColor: colors.background,
		paddingHorizontal: spacing.sm,
		paddingVertical: 5,
		borderRadius: radius.full,
		borderCurve: "continuous",
	},
	ctaLabel: {
		fontFamily: fonts.semibold,
		fontSize: 11,
		lineHeight: 13,
		color: colors.primary,
	},
	artwork: {
		width: "42%",
		alignItems: "flex-end",
		justifyContent: "flex-end",
		paddingRight: 2,
	},
	heroImage: {
		width: "100%",
		height: SLIDE_HEIGHT + 12,
		marginBottom: -10,
	},
	dots: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 4,
	},
	dot: {
		width: 5,
		height: 5,
		borderRadius: radius.full,
		backgroundColor: colors.borderStrong,
	},
	dotActive: {
		width: 14,
		backgroundColor: colors.primary,
	},
});
