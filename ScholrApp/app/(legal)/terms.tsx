import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TermsScreen() {
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
          Terms of Service
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
            1. Acceptance of Terms
          </Text>
          <Text className="text-base font-normal text-text-secondary leading-relaxed">
            By accessing and using the Scholr platform, you accept and agree to
            be bound by the terms and provision of this agreement.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-medium text-text-primary mb-2">
            2. User Accounts
          </Text>
          <Text className="text-base font-normal text-text-secondary leading-relaxed">
            You must be a registered student or faculty member to use certain
            features. You are responsible for maintaining the confidentiality of
            your account credentials.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-medium text-text-primary mb-2">
            3. Academic Integrity
          </Text>
          <Text className="text-base font-normal text-text-secondary leading-relaxed">
            Scholr is designed to facilitate learning. Any form of cheating,
            plagiarism, or misuse of the platform's study materials or
            attendance systems is strictly prohibited.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
