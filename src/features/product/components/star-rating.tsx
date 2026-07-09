import { StyleSheet, View } from "react-native";

import { AppSymbol } from "@/shared/components/app-symbol";
import { colors } from "@/theme/colors";

type StarRatingProps = {
	rating: number;
	size?: number;
	gap?: number;
};

export function StarRating({ rating, size = 12, gap = 2 }: StarRatingProps) {
	const filled = Math.round(rating * 2) / 2;
	const fullStars = Math.floor(filled);
	const hasHalf = filled - fullStars >= 0.5;

	return (
		<View style={[styles.row, { gap }]}>
			{Array.from({ length: 5 }).map((_, index) => {
				const isFull = index < fullStars;
				const isHalf = !isFull && hasHalf && index === fullStars;

				return (
					<AppSymbol
						key={`star-${index}`}
						name={
							isFull ? "star.fill" : isHalf ? "star.leadinghalf.filled" : "star"
						}
						size={size}
						tintColor={isFull || isHalf ? colors.star : colors.border}
					/>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
});
