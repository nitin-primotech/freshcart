import { useCallback } from "react";
import {
	findNodeHandle,
	type ScrollView,
	UIManager,
	type View,
} from "react-native";

import { keyboardToolbarHeight } from "@/shared/components/keyboard-done-accessory";

type ScrollRef = React.RefObject<ScrollView | null>;
type AnchorRef = React.RefObject<View | null>;

/**
 * Scrolls a ScrollView so a focused input anchor stays above the keyboard toolbar.
 */
export function useScrollInputIntoView(scrollRef: ScrollRef) {
	const scrollToInput = useCallback(
		(anchorRef: AnchorRef, extraOffset = spacingAboveKeyboard()) => {
			const scrollView = scrollRef.current;
			const anchor = anchorRef.current;
			if (!scrollView || !anchor) {
				return;
			}

			const scrollHandle = findNodeHandle(scrollView);
			const anchorHandle = findNodeHandle(anchor);
			if (!scrollHandle || !anchorHandle) {
				return;
			}

			requestAnimationFrame(() => {
				UIManager.measureLayout(
					anchorHandle,
					scrollHandle,
					() => {},
					(_x, y) => {
						scrollRef.current?.scrollTo({
							y: Math.max(0, y - extraOffset),
							animated: true,
						});
					},
				);
			});
		},
		[scrollRef],
	);

	return scrollToInput;
}

function spacingAboveKeyboard() {
	return keyboardToolbarHeight + 16;
}
