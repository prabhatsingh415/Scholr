import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Image,
  Text,
} from "react-native";
import AuthForm from "../../components/form/AuthForm";
import { icon } from "../../assets/index";
import { useSignup } from "@/src/hooks/auth/useSignup";
import { ErrorCard } from "../../components/ui/ErrorCard";
import { useRouter } from "expo-router";
import useUserStore from "@/src/store/userStore";

import Footer from "../../components/ui/Footer";
import Loader from "@/components/ui/Loader";

export default function SignupScreen() {
  const router = useRouter();
  const { mutate, isPending } = useSignup();
  const setTempCollegeId = useUserStore((state: any) => state.setTempCollegeId);

  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSignup = (formData: any) => {
    mutate(formData, {
      onSuccess: (data) => {
        if (data.success) {
          setTempCollegeId(formData.collegeId);
          router.push("/(auth)/verify_otp");
        }
      },
      onError: (error: any) => {
        const msg =
          error.response?.data?.message ||
          "Signup Failed: Something went wrong";
        setErrorMessage(msg);
        setErrorVisible(true);
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
      className="mb-8"
    >
      {isPending && <Loader children="Sending OTP..." />}
      {/* Notifications */}
      <ErrorCard
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className="mt-8"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 p-6 justify-center items-center">
            <View className="mb-8 gap-4 flex flex-col justify-center items-center">
              <Image
                source={icon}
                style={{ resizeMode: "contain", objectFit: "cover" }}
                className="w-36 h-36 rounded-full"
              />
              <Text className="text-lg text-text-primary font-bold italic">
                Welcome to{" "}
                <Text className="font-bold text-brand italic">Scholr</Text> App
              </Text>
            </View>
            <AuthForm mode="signup" onSubmitData={handleSignup} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      {/* Footer */}
      <Footer />
    </KeyboardAvoidingView>
  );
}
