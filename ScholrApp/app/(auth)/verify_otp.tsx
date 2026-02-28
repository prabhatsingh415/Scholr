import { ErrorCard } from "@/components/ui/ErrorCard";
import { InfoCard } from "@/components/ui/InfoCard";
import { useVerifyOtp } from "@/src/hooks/useVerifyOtp";
import useAuthStore from "@/src/store/authStore";
import useUserStore from "@/src/store/userStore";
import { router } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";

export default function VerifyOTPScreen() {
  const setTokens = useAuthStore((state: any) => state.setTokens);
  const setUser = useUserStore((state: any) => state.setData);
  const collegeId = useUserStore((state: any) => state.tempCollegeId);
  const { mutate, isPending } = useVerifyOtp();

  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [infoVisible, setInfoVisible] = useState<boolean>(false);
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  const inputRef = useRef<TextInput>(null);
  const otpLength = 6;
  const otpArray = new Array(otpLength).fill(0);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (collegeId) {
      setInfoMessage("OTP successfully sent to your email!");
      setInfoVisible(true);

      const timer = setTimeout(() => setInfoVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [collegeId]);

  const handleRedirect = async () => {
    try {
      await Linking.openURL("https://prabhatsingh-two.vercel.app/");
    } catch (err) {
      console.log("Redirect failed:", err);
    }
  };

  const isOtpValid = otp.length === otpLength && /^\d+$/.test(otp);

  const handleVerify = () => {
    mutate(
      { otp, collegeId },
      {
        onSuccess: (data: any) => {
          if (data.success) {
            setInfoVisible(true);
            setInfoMessage("Signup successfull");
            const access = data.data.access_token;
            const rawCookie = data.headers?.["set-cookie"]?.[0];
            const refresh = rawCookie
              ? extractTokenFromCookie(rawCookie)
              : null;

            setTokens({
              access_token: access,
              refresh_token: refresh,
            });

            setUser(data.data.user);
          }
        },
        onError: (error: any) => {
          const msg =
            error.response?.data?.message ||
            "Login Failed: Something went Wrong";
          setErrorMessage(msg);
          setErrorVisible(true);
        },
      }
    );
  };

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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#0A0A0A] mb-8"
    >
      <InfoCard visible={infoVisible} message={infoMessage} />
      <ErrorCard
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />

      <Pressable
        onPress={Keyboard.dismiss}
        className="flex-1 justify-center p-6"
      >
        <View className="mb-10">
          <Text className="text-3xl text-white font-bold mb-2 italic">
            Verify <Text className="text-brand">Account</Text>
          </Text>
          <Text className="text-gray-400 text-sm tracking-wide">
            We've sent a 6-digit code to your college email.
          </Text>
        </View>

        {/* OTP Boxes Container */}
        <Pressable
          onPress={handlePress}
          className="flex-row justify-between mb-10"
        >
          {otpArray.map((_, index) => {
            const char = otp[index] || "";
            const isFocused = otp.length === index;

            return (
              <View
                key={index}
                className={`w-12 h-16 border-2 rounded-xl justify-center items-center ${
                  isFocused
                    ? "border-brand bg-brand/10"
                    : "border-border-subtle bg-[#1A1A1A]"
                }`}
              >
                <Text className="text-white text-2xl font-bold">{char}</Text>
              </View>
            );
          })}
        </Pressable>

        <TextInput
          ref={inputRef}
          value={otp}
          onChangeText={setOtp}
          maxLength={otpLength}
          keyboardType="number-pad"
          caretHidden={true}
          style={{
            position: "absolute",
            opacity: 0,
            width: 1,
            height: 1,
          }}
        />

        <TouchableOpacity
          disabled={!isOtpValid}
          activeOpacity={isOtpValid ? 0.8 : 1}
          className={`p-5 rounded-2xl items-center shadow-lg ${
            isOtpValid ? "bg-brand shadow-brand/20" : "bg-brand/45 opacity-50"
          }`}
          onPress={handleVerify}
        >
          <Text className="text-black font-extrabold text-lg uppercase tracking-widest">
            Verify & Continue
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-6 items-center">
          <Text className="text-gray-500 text-xs">
            Didn't receive code?{" "}
            <Text className="text-brand font-bold">Resend OTP</Text>
          </Text>
        </TouchableOpacity>
      </Pressable>

      <View className="flex flex-col items-center justify-center gap-2 mb-8">
        <View className="flex flex-row justify-center items-center">
          <View className="h-[1px] w-10 ml-4 bg-border-subtle opacity-50" />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleRedirect}
            className="flex-row items-center mx-4"
          >
            <Text className="text-text-secondary text-[10px] tracking-[2px] uppercase">
              Designed & Crafted by
              <Text className="text-brand font-extrabold tracking-normal">
                {"  "}
                PRABHAT SINGH
              </Text>
            </Text>
          </TouchableOpacity>

          <View className="h-[1px] w-10 bg-border-subtle opacity-50" />
        </View>

        <Text className="text-[9px] text-text-secondary opacity-30 font-mono italic uppercase tracking-tighter ">
          build.v0.1.415.226_stable
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
