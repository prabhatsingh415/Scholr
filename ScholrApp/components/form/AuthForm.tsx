import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Key, Lock } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";

import { useRouter } from "expo-router";

interface AuthFormProps {
  mode: "login" | "signup";
  onSubmitData: (data: any) => void;
}

const AuthForm = ({ mode, onSubmitData }: AuthFormProps) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { collegeId: "", password: "" },
  });

  const isSignup = mode === "signup";

  return (
    <View className="w-full space-y-4 gap-6 mb-12 py-4">
      <Controller
        control={control}
        name="collegeId"
        rules={{ required: "College ID is required" }}
        render={({ field: { onChange, value, onBlur } }) => (
          <View className="flex-row items-center bg-background-secondary border border-border-subtle rounded-xl px-4 mb-2">
            <Key size={20} color="#666666" />
            <TextInput
              className="flex-1 p-4 text-text-primary"
              placeholder="College ID"
              placeholderTextColor="#666666"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          </View>
        )}
      />
      {errors.collegeId?.message ? (
        <Text className="text-red-500 mb-2 ml-1 text-xs">
          {String(errors.collegeId.message)}
        </Text>
      ) : null}
      <Controller
        control={control}
        name="password"
        rules={{
          required: "Password is required",
          minLength: { value: 8, message: "Min 8 characters required" },
          pattern: {
            value:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$&~!])(?=.*\d)[A-Za-z\d@$&~!]{8,50}$/,
            message:
              "Password must contain uppercase, lowercase, number and special character",
          },
        }}
        render={({ field: { onChange, value, onBlur } }) => (
          <View className="flex-row items-center bg-background-secondary border border-border-subtle rounded-xl px-4">
            <Lock size={20} color="#666666" />
            <TextInput
              className="flex-1 p-4 text-text-primary"
              placeholder="Password"
              placeholderTextColor="#666666"
              secureTextEntry
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          </View>
        )}
      />
      {errors.password?.message ? (
        <Text className="text-red-500 mb-2 ml-1 text-xs leading-5">
          {String(errors.password.message)}
        </Text>
      ) : null}

      <TouchableOpacity
        className="bg-brand p-4 rounded-xl items-center "
        onPress={handleSubmit(onSubmitData)}
      >
        <Text className="text-text-primary font-bold text-lg">
          {isSignup ? "Sign Up" : "Sign In"}
        </Text>
      </TouchableOpacity>

      {mode === "signup" ? (
        <View className="mt-auto pt-10 pb-6 items-center gap-2">
          <Text className="text-sm text-text-secondary text-center px-4 leading-5 opacity-80">
            By signing up, you agree to our{"\n"}
            <Text
              className="text-brand font-medium"
              onPress={() => router.push("/(legal)/terms")}
            >
              Terms of Service
            </Text>
            {" & "}
            <Text
              className="text-brand font-medium"
              onPress={() => router.push("/(legal)/privacy")}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
      ) : (
        ""
      )}

      <View className="flex-row justify-center items-center mt-4">
        <Text className="text-xs text-text-secondary opacity-80">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            isSignup ? router.replace("/login") : router.replace("/signup");
          }}
        >
          <Text className="text-xs text-brand font-bold">
            {isSignup ? " Sign in" : " Sign up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthForm;
