import { StatusBar } from "expo-status-bar";

type AppStatusBarProps = {
	style?: "auto" | "inverted" | "light" | "dark";
};

/** Edge-to-edge status bar — background draws behind it (translucent by default on Android). */
export function AppStatusBar({ style = "dark" }: AppStatusBarProps) {
	return <StatusBar style={style} />;
}
