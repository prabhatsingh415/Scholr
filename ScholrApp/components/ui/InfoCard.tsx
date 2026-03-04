import React from "react";
import { View, Text } from "react-native";
import { CheckCircle2 } from "lucide-react-native";
import { InfoToastProps } from "@/types/ui";

export const InfoCard = ({ message, visible }: InfoToastProps) => {
  if (!visible) return null;

  return (
    <View className="absolute top-12 left-6 right-6 z-50">
      <View className="bg-[#1A1A1A] border border-brand/30 flex-row items-center p-4 rounded-2xl shadow-2xl">
        <View className="bg-brand/20 p-2 rounded-full mr-3">
          <CheckCircle2 size={20} color="#FACC15" />
        </View>
        <Text className="text-white font-medium flex-1">{message}</Text>
      </View>
    </View>
  );
};
