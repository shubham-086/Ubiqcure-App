import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppProvider } from "@/context/AppContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//     NotoSans: require("@/assets/fonts/NotoSans-Regular.ttf"),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//       checkLoginStatus();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   const checkLoginStatus = async () => {
//     let user = await AsyncStorage.getItem("user");
//     if (user) {
//       console.log(user);
//       router.replace("(drawer)");
//     } else {
//       console.log(user);
//       router.replace("(auth)");
//     }
//   };

//   return (
//     <AppProvider>
//       <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//         <SafeAreaView style={{ flex: 1 }}>
//           <Stack
//             screenOptions={{ headerShown: false }}
//             initialRouteName="(auth)"
//           >
//             <Stack.Screen
//               name="(drawer)"
//               options={{ animation: "slide_from_right" }}
//             />
//             <Stack.Screen
//               name="(auth)"
//               options={{ animation: "slide_from_right" }}
//             />
//           </Stack>
//         </SafeAreaView>
//       </ThemeProvider>
//     </AppProvider>
//   );
// }

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    NotoSans: require("@/assets/fonts/NotoSans-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      checkLoginStatus();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const checkLoginStatus = async () => {
    let user = await AsyncStorage.getItem("user");
    if (user) {
      console.log(user);
      router.replace("(drawer)");
    } else {
      console.log(user);
      router.replace("(auth)");
    }
  };

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="(drawer)"
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="(auth)"
              options={{ animation: "slide_from_right" }}
            />
          </Stack>
        </SafeAreaView>
      </ThemeProvider>
    </AppProvider>
  );
}
