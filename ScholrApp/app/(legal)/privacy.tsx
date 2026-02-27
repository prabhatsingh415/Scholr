import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <View className="px-6 py-4 flex-row items-center border-b border-border-subtle">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 p-2 -ml-2 rounded-full active:bg-background-elevated"
        >
          <Ionicons name="arrow-back" size={24} color="#FAFAFA" />
        </TouchableOpacity>
        <Text className="text-2xl font-light text-text-primary tracking-tight">
          Privacy Policy
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm font-normal text-text-secondary tracking-wide mb-8 uppercase">
          LAST UPDATED: FEBRUARY 2026
        </Text>

        <View className="mb-6">
          <Text className="text-lg font-medium text-text-primary mb-2">
            1. Information We Collect
          </Text>
          <Text className="text-base font-normal text-text-secondary leading-relaxed">
            When you use Scholr, we may collect personal information that you
            provide to us, such as your name, email address, student ID, and
            profile picture. We also automatically collect certain device and
            usage data to improve our services.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-medium text-text-primary mb-2">
            2. How We Use Your Information
          </Text>
          <Text className="text-base font-normal text-text-secondary leading-relaxed mb-3">
            We use the information we collect primarily to provide, maintain,
            and improve the Scholr platform. This includes:
          </Text>

          <View className="pl-4">
            <Text className="text-base font-normal text-text-secondary leading-relaxed mb-1">
              • Managing your account and verifying your identity.
            </Text>
            <Text className="text-base font-normal text-text-secondary leading-relaxed mb-1">
              • Processing attendance via QR codes.
            </Text>
            <Text className="text-base font-normal text-text-secondary leading-relaxed mb-1">
              • Enabling communication features like batch chats.
            </Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-medium text-text-primary mb-2">
            3. Data Sharing and Security
          </Text>
          <Text className="text-base font-normal text-text-secondary leading-relaxed">
            We do not sell your personal data. We may share information with
            your educational institution as required for academic features. We
            implement industry-standard security measures to protect your data,
            but no electronic transmission is completely secure.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-medium text-text-primary mb-2">
            4. Your Rights
          </Text>
          <Text className="text-base font-normal text-text-secondary leading-relaxed">
            Depending on your jurisdiction, you may have the right to access,
            correct, or delete your personal information. If you wish to
            exercise these rights, please contact our support team.
          </Text>
        </View>

        <View className="mb-10">
          <Text className="text-lg font-medium text-text-primary mb-2">
            Contact Us
          </Text>
          <Text className="text-base font-normal text-text-secondary leading-relaxed">
            If you have any questions about this Privacy Policy, please contact
            us at support@scholr.com.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
