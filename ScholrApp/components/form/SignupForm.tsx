import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Key, Lock } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { Linking } from "react-native";

const SignupForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { collegeId: "", password: "" },
  });

  const onSubmit = (data: {}) => {
    console.log("Clean Form Data:", data);
  };

  const handleRedirect = async () => {
    const url = "https://prabhatsingh-two.vercel.app/";
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open this URL");
    }
  };

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
      {errors.collegeId && typeof errors.collegeId.message === "string" && (
        <Text className="text-red-500 mb-2 ml-1 text-xs">
          {errors.collegeId.message}
        </Text>
      )}

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
              "Password must contain:\n• One uppercase letter\n• One lowercase letter\n• One number\n• One special character",
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
      {errors.password && typeof errors.password.message === "string" && (
        <Text className="text-red-500 mb-2 ml-1 text-xs leading-5">
          {errors.password.message}
        </Text>
      )}

      <TouchableOpacity
        className="bg-brand p-4 rounded-xl items-center "
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-text-primary font-bold text-lg">Sign Up</Text>
      </TouchableOpacity>

      <View className="mt-auto pt-10 pb-6 items-center">
        <Text className="text-sm text-text-secondary text-center px-4 leading-5 opacity-80">
          By signing up, you agree to our{"\n"}
          <Text className="text-brand font-medium">
            Terms of Service
          </Text> &{" "}
          <Text className="text-brand font-medium">Privacy Policy</Text>
        </Text>

        <View className="flex-row items-center justify-center mt-12 mb-2">
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

        <Text className="text-[9px] text-text-secondary opacity-30 font-mono italic uppercase tracking-tighter">
          build.v0.1.415.226_stable
        </Text>
      </View>
    </View>
  );
};

export default SignupForm;
