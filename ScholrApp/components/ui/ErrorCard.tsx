import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { AlertCircle } from "lucide-react-native";
import { ErrorModalProps } from "@/types/ui";

export const ErrorCard = ({ visible, message, onClose }: ErrorModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/80 px-10">
        <View className="bg-[#1A1A1A] w-full p-8 rounded-[32px] border border-red-500/20 items-center">
          <View className="bg-red-500/10 p-4 rounded-full mb-4">
            <AlertCircle size={40} color="#EF4444" />
          </View>

          <Text className="text-white text-xl font-bold mb-2">Oops!</Text>
          <Text className="text-gray-400 text-center mb-8 leading-5">
            {message || "Something went wrong. Please try again later."}
          </Text>

          <TouchableOpacity
            onPress={onClose}
            className="bg-red-500/10 border border-red-500/50 py-4 w-full rounded-2xl items-center"
          >
            <Text className="text-red-500 font-bold text-lg">Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
