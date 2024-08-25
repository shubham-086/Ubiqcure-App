/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
const primaryColor = "#006298";
const tintColorLight = primaryColor;
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#C0C0C0",
    tabIconDefault: "#C0C0C0",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#191970",
    tint: tintColorDark,
    icon: "#f3f6f4",
    tabIconDefault: "#f3f6f4",
    tabIconSelected: tintColorDark,
  },
};
