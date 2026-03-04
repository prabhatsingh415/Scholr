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
import { ErrorCard } from "../../components/ui/ErrorCard";
import { useLogin } from "@/src/hooks/auth/useLogin";
import useAuthStore from "@/src/store/authStore";
import Footer from "@/components/ui/Footer";
import Loader from "@/components/ui/Loader";
import useUserStore from "@/src/store/userStore";

const login = () => {
  const setTokens = useAuthStore((state: any) => state.setTokens);
  const setUser = useUserStore((state: any) => state.setData);

  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { mutate, isPending } = useLogin();

  const handleLogin = (formData: any) => {
    mutate(formData, {
      onSuccess: (response) => {
        const backendResponse = response.data;
        if (backendResponse && backendResponse.success) {
          const access = backendResponse.data.access_token;

          const rawCookie =
            response.headers?.["set-cookie"]?.[0] ||
            response.headers?.["Set-Cookie"]?.[0];
          const refresh = rawCookie ? extractTokenFromCookie(rawCookie) : null;

          setTokens({
            access_token: access,
            refresh_token: refresh,
          });

          setUser(backendResponse.data.user);
        }
      },
      onError: (error: any) => {
        const msg =
          error.response?.data?.message ||
          "Login Failed: Something went wrong!";
        setErrorMessage(msg);
        setErrorVisible(true);
      },
    });
  };

  //helper
  const extractTokenFromCookie = (cookieStr: string) => {
    return cookieStr.split(";")[0].split("=")[1];
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
      className="mb-8"
    >
      {isPending && <Loader children="Logging in..." />}

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
      <Footer />
    </KeyboardAvoidingView>
  );
};

export default login;
