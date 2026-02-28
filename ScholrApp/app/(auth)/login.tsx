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
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import AuthForm from "../../components/form/AuthForm";
import { icon } from "../../assets/index";
import { InfoCard } from "@/components/ui/InfoCard";
import { ErrorCard } from "../../components/ui/ErrorCard";
import { useLogin } from "@/src/hooks/useLogin";
import useAuthStore from "@/src/store/authStore";

const login = () => {
  const setTokens = useAuthStore((state: any) => state.setTokens);
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [infoVisible, setInfoVisible] = useState<boolean>(false);

  const { mutate, isPending } = useLogin();

  const handleRedirect = async () => {
    try {
      await Linking.openURL("https://prabhatsingh-two.vercel.app/");
    } catch (err) {
      console.log("Redirect failed:", err);
    }
  };

  const handleLogin = (formData: any) => {
    mutate(formData, {
      onSuccess: (response) => {
        if (response.success) {
          const access = response.data.access_token;

          const rawCookie = response.headers?.["set-cookie"]?.[0];
          const refresh = rawCookie ? extractTokenFromCookie(rawCookie) : null;

          setTokens({
            access_token: access,
            refresh_token: refresh,
          });

          setInfoVisible(true);
          setTimeout(() => setInfoVisible(false), 1500);
        }
      },
      onError: (error: any) => {
        const msg =
          error.response?.data?.message || "Login Failed: Network Error";
        setErrorMessage(msg);
        setErrorVisible(true);
      },
    });
  };

  //helper
  const extractTokenFromCookie = (cookieStr: string) => {
    return cookieStr.split(";")[0].split("=")[1];
  };

  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0A0A0A]">
        <ActivityIndicator size="large" color="#00FFAA" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
    >
      {/* Notifications */}
      <InfoCard
        visible={infoVisible}
        message="OTP successfully sent to your email!"
      />
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
            <AuthForm mode="login" onSubmitData={handleLogin} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      {/* Footer */}
      <View className="flex flex-col items-center justify-center gap-2 mb-8">
        <View className="flex flex-row justify-center items-center">
          <View className="h-[1px] w-10 ml-4 bg-border-subtle opacity-50" />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleRedirect}
            className="flex-row items-center mx-4"
          >
            <Text className="text-text-secondary text-[10px] tracking-[2px] uppercase">
              Designed & Crafted by{" "}
              <Text className="text-brand font-extrabold tracking-normal">
                {" "}
                PRABHAT SINGH
              </Text>
            </Text>
          </TouchableOpacity>
          <View className="h-[1px] w-10 bg-border-subtle opacity-50" />
        </View>
        <Text className="text-[9px] text-text-secondary opacity-30 font-mono italic uppercase tracking-tighter">
          build.v0.1.415.226_stable
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default login;
