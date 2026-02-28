import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthStore from "@/src/store/authStore";

const queryClient = new QueryClient();

export default function AuthLayout() {
  const { auth } = useAuthStore();
  const deleteTokens = useAuthStore((state) => state.deleteTokens);
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    deleteTokens();
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    // Route Protection
    if (!auth?.access_token && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (auth?.access_token && inAuthGroup) {
      router.replace("/(tabs)/home");
    }
  }, [auth?.access_token, segments, isReady]);

  // Navigation Bar styling
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("visible");
      NavigationBar.setBackgroundColorAsync("transparent");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
