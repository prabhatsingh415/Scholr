import useAuthStore from "@/src/store/authStore";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";

import { View } from "react-native";

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <View style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0A0A0A" },
            animation: "fade",
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </ThemeProvider>
  );
}
