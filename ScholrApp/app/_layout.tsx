import "../global.css";
import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthStore from "@/src/store/authStore";
import Loader from "@/components/ui/Loader";
import { Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { getMessaging } from "@react-native-firebase/messaging";
import { PermissionGuard } from "@/components/permission/PermissionGuard";

const queryClient = new QueryClient();

getMessaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background message received", remoteMessage);
});

export default function AuthLayout() {
  const { auth, _hasHydrated, deleteTokens } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        remoteMessage.notification?.title || "New Notification",
        remoteMessage.notification?.body
      );

      console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

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
    <PermissionGuard>
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
    </PermissionGuard>
  );
}
