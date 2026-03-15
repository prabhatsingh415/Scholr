import "../global.css";
import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthStore from "@/src/store/authStore";
import Loader from "@/components/ui/Loader";

const queryClient = new QueryClient();

export default function AuthLayout() {
  const { auth, _hasHydrated, deleteTokens } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    // deleteTokens();
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    if (!_hasHydrated) return;

    const currentSegment = segments[0] as string | undefined;

    const inAuthGroup = currentSegment === "(auth)";

    const isAtRoot =
      !currentSegment || currentSegment === "index" || currentSegment === "";

    // Route Protection
    if (!auth?.access_token && !inAuthGroup) {
      router.replace("/(auth)/login");

      router.replace("/(tabs)/home");
    } else if (auth?.access_token) {
      if (inAuthGroup || isAtRoot) {
        router.replace("/(tabs)/home");
      }
    }
  }, [auth?.access_token, segments, isReady, _hasHydrated]);

  // Navigation Bar styling
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("visible");
      NavigationBar.setBackgroundColorAsync("transparent");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  if (!_hasHydrated) {
    return <Loader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0A0A0A" },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
