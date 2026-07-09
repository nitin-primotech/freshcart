import { StyleSheet, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";

import {
	AnimatedCodeNumber,
	type OtpDigitStatus,
} from "@/features/auth/components/verification-code/animated-code-number";
import { spacing } from "@/theme/spacing";

type VerificationCodeProps = {
	code: number[];
	maxLength?: number;
	status: SharedValue<OtpDigitStatus>;
};

export function VerificationCode({
	code,
	maxLength = 4,
	status,
}: VerificationCodeProps) {
	return (
		<View style={styles.container}>
			{Array.from({ length: maxLength }).map((_, index) => (
				<View key={index} style={styles.codeContainer}>
					<AnimatedCodeNumber
						code={code[index]}
						highlighted={code.length === index}
						status={status}
					/>
				</View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: spacing.xs,
		width: "100%",
	},
	codeContainer: {
		flex: 1,
		maxWidth: 48,
		alignItems: "center",
		justifyContent: "center",
	},
});
