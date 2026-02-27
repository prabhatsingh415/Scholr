import { useEffect } from "react";
import { Stack } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

export default function AuthLayout() {
  useEffect(() => {
    const hideNavigationKeys = async () => {
      if (Platform.OS === "android") {
        await NavigationBar.setVisibilityAsync("hidden");
        await NavigationBar.setBehaviorAsync("overlay-swipe");
      }
    };

    hideNavigationKeys();
  }, []);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
