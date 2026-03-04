import { View, Text, TouchableOpacity, Modal } from "react-native";
import React from "react";
import { LogOut } from "lucide-react-native";
import { LogoutModalProps } from "@/types/ui";

const LogoutModal = ({ visible, onClose, onConfirm }: LogoutModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
        className="flex-1 items-center justify-center px-6"
      >
        <View className="bg-background-box w-full p-8 rounded-[32px] border border-white/10 shadow-2xl">
          <View className="bg-red-500/10 w-20 h-20 rounded-full items-center justify-center mb-6 self-center border border-red-500/20">
            <LogOut size={36} color="#EF4444" />
          </View>

          <Text className="text-white text-2xl font-bold text-center mb-2">
            Signing Out?
          </Text>
          <Text className="text-text-secondary text-center mb-10 leading-6 px-2">
            Are you sure you want to leave? You'll need to enter your college ID
            and password to get back in.
          </Text>

          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="flex-1 bg-white/5 py-4 rounded-2xl border border-white/5"
            >
              <Text className="text-white text-center font-bold text-lg">
                Stay
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              activeOpacity={0.8}
              className="flex-1 bg-red-600 py-4 rounded-2xl shadow-lg shadow-red-900/40"
            >
              <Text className="text-white text-center font-bold text-lg">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;
