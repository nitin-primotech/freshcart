import { StyleSheet, Text, View } from "react-native";
import { StarRating } from "@/features/product/components/star-rating";
import type { ProductReview } from "@/features/product/constants/product.constants";
import { AppSymbol } from "@/shared/components/app-symbol";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { fonts } from "@/theme/typography";

type ProductReviewCardProps = {
	review: ProductReview;
};

export function ProductReviewCard({ review }: ProductReviewCardProps) {
	const initials = review.name
		.split(" ")
		.map((part) => part[0])
		.join("");

	return (
		<View style={styles.reviewCard}>
			<View style={styles.reviewTop}>
				<View style={styles.avatar}>
					<Text style={styles.avatarText}>{initials}</Text>
				</View>
				<View style={styles.reviewMeta}>
					<Text style={styles.reviewer}>{review.name}</Text>
					{review.verified ? (
						<View style={styles.verified}>
							<AppSymbol
								name="checkmark.circle.fill"
								size={10}
								tintColor={colors.success}
							/>
							<Text style={styles.verifiedText}>Verified Buyer</Text>
						</View>
					) : null}
				</View>
				<Text style={styles.reviewDate}>{review.daysAgo} days ago</Text>
			</View>
			<StarRating rating={review.rating} size={11} />
			<Text style={styles.reviewText}>{review.text}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	reviewCard: {
		backgroundColor: colors.backgroundElevated,
		borderRadius: 12,
		borderCurve: "continuous",
		borderWidth: 1,
		borderColor: colors.border,
		padding: spacing.md,
		gap: spacing.xs,
	},
	reviewTop: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	avatar: {
		width: 34,
		height: 34,
		borderRadius: 17,
		backgroundColor: "rgba(212, 84, 60, 0.12)",
		alignItems: "center",
		justifyContent: "center",
	},
	avatarText: {
		fontFamily: fonts.bold,
		fontSize: 11,
		color: colors.primary,
	},
	reviewMeta: {
		flex: 1,
		gap: 2,
	},
	reviewer: {
		fontFamily: fonts.semibold,
		fontSize: 12,
		lineHeight: 16,
		color: colors.textPrimary,
	},
	verified: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	verifiedText: {
		fontFamily: fonts.medium,
		fontSize: 9,
		lineHeight: 12,
		color: colors.success,
	},
	reviewDate: {
		fontFamily: fonts.regular,
		fontSize: 10,
		lineHeight: 13,
		color: colors.textTertiary,
	},
	reviewText: {
		fontFamily: fonts.regular,
		fontSize: 12,
		lineHeight: 17,
		color: colors.textSecondary,
	},
});
