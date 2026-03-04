import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { LoaderProps } from "@/types/ui";

const Loader = ({ children }: LoaderProps) => {
  return (
    <View className="absolute inset-0 z-50 items-center justify-center">
      <BlurView intensity={60} tint="dark" className="absolute inset-0" />
      <View className="absolute inset-0 bg-black/30" />
      <View className="bg-[#1A1A1A] px-8 py-8 rounded-3xl border border-white/10 items-center">
        <ActivityIndicator size="large" color="#00FFAA" />

        {children && (
          <Text className="text-white mt-4 text-[11px] font-semibold tracking-widest uppercase text-center">
            {children ? children : "Loading..."}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Loader;
