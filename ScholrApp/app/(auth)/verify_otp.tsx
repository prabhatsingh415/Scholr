import { ErrorCard } from "@/components/ui/ErrorCard";
import Footer from "@/components/ui/Footer";
import { InfoCard } from "@/components/ui/InfoCard";
import Loader from "@/components/ui/Loader";
import { useResendOtp } from "@/src/hooks/auth/useResendOtp";
import { useVerifyOtp } from "@/src/hooks/auth/useVerifyOtp";
import useAuthStore from "@/src/store/authStore";
import useUserStore from "@/src/store/userStore";
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
} from "react-native";

export default function VerifyOTPScreen() {
  const setTokens = useAuthStore((state: any) => state.setTokens);
  const setUser = useUserStore((state: any) => state.setData);
  const collegeId = useUserStore((state: any) => state.tempCollegeId);

  const { mutate, isPending } = useVerifyOtp();
  const { mutate: resendMutate, isPending: isResending } = useResendOtp();

  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [infoVisible, setInfoVisible] = useState<boolean>(false);
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  const intervalRef = useRef<any>(null);
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

  const isOtpValid = otp.length === otpLength && /^\d+$/.test(otp);

  const handleVerify = () => {
    mutate(
      { otp, collegeId },
      {
        onSuccess: (response: any) => {
          const backendResponse = response.data;
          if (backendResponse && backendResponse.success) {
            setInfoVisible(true);
            setInfoMessage("Signup successfull");
            const access = backendResponse.data.access_token;
            const rawCookie =
              response.headers?.["set-cookie"]?.[0] ||
              response.headers?.["Set-Cookie"]?.[0];

            const refresh = rawCookie
              ? extractTokenFromCookie(rawCookie)
              : null;

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

  useEffect(() => {
    if (timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timer]);

  const handleResend = () => {
    if (!canResend) return;

    resendMutate(collegeId, {
      onSuccess: () => {
        setInfoMessage("A new OTP has been sent!");
        setInfoVisible(true);
        setTimer(60); // Reset timer
        setCanResend(false);
      },
      onError: (error: any) => {
        setErrorMessage("Failed to resend OTP. Try again later.");
        setErrorVisible(true);
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#0A0A0A] mb-8"
    >
      {(isPending || isResending) && (
        <Loader>{isPending ? "Verifying OTP..." : "Resending OTP..."}</Loader>
      )}
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

        <TouchableOpacity
          disabled={!canResend || isResending}
          onPress={handleResend}
          className="mt-6 items-center"
        >
          <Text className="text-gray-500 text-xs">
            {canResend ? (
              <>
                Didn't receive code?{" "}
                <Text className="text-brand font-bold uppercase tracking-tighter">
                  Resend OTP
                </Text>
              </>
            ) : (
              <>
                Resend OTP available in{" "}
                <Text className="text-brand font-mono font-bold">{timer}s</Text>
              </>
            )}
          </Text>
        </TouchableOpacity>
      </Pressable>

      {/* Footer */}
      <Footer />
    </KeyboardAvoidingView>
  );
}
