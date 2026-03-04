import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";

const UpdatePasswordForm = ({ onSubmitData, onCancel }: any) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onChange",
  });

  const newPassword = watch("newPassword");

  return (
    <View className="w-full gap-4 py-2">
      {/* Current Password */}
      <Controller
        control={control}
        name="currentPassword"
        rules={{ required: "Current password is required" }}
        render={({ field: { onChange, value, onBlur } }) => (
          <View className="bg-background-secondary border border-border-subtle rounded-xl px-4">
            <TextInput
              secureTextEntry
              className="p-4 text-text-primary"
              placeholder="Current Password"
              placeholderTextColor="#666666"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          </View>
        )}
      />
      {errors.currentPassword && (
        <Text className="text-red-500 text-[10px] ml-1">
          {errors.currentPassword.message}
        </Text>
      )}

      {/* New Password */}
      <Controller
        control={control}
        name="newPassword"
        rules={{
          required: "New password is required",
          minLength: { value: 8, message: "Minimum 8 characters" },
          pattern: {
            value:
              /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=\S+$).{8,}$/,
            message: "Must include Upper, Lower, Number & Special char",
          },
        }}
        render={({ field: { onChange, value, onBlur } }) => (
          <View className="bg-background-secondary border border-border-subtle rounded-xl px-4">
            <TextInput
              secureTextEntry
              className="p-4 text-text-primary"
              placeholder="New Password"
              placeholderTextColor="#666666"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          </View>
        )}
      />
      {errors.newPassword && (
        <Text className="text-red-500 text-[10px] ml-1">
          {errors.newPassword.message}
        </Text>
      )}

      {/* Confirm Password */}
      <Controller
        control={control}
        name="confirmNewPassword"
        rules={{
          required: "Please confirm your password",
          validate: (value) =>
            value === newPassword || "Passwords do not match",
        }}
        render={({ field: { onChange, value, onBlur } }) => (
          <View className="bg-background-secondary border border-border-subtle rounded-xl px-4">
            <TextInput
              secureTextEntry
              className="p-4 text-text-primary"
              placeholder="Confirm New Password"
              placeholderTextColor="#666666"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          </View>
        )}
      />
      {errors.confirmNewPassword && (
        <Text className="text-red-500 text-[10px] ml-1">
          {errors.confirmNewPassword.message}
        </Text>
      )}

      {/* Action Buttons */}
      <View className="flex-row gap-4 mt-4">
        <TouchableOpacity
          disabled={!isDirty || !isValid}
          className={`flex-1 p-4 rounded-xl items-center ${
            !isDirty || !isValid ? "bg-gray-800 opacity-50" : "bg-brand"
          }`}
          onPress={handleSubmit(onSubmitData)}
        >
          <Text
            className={`font-bold ${!isDirty || !isValid ? "text-gray-500" : "text-black"}`}
          >
            Update
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-background-box p-4 rounded-xl items-center border border-white/5"
          onPress={onCancel}
        >
          <Text className="text-white font-bold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UpdatePasswordForm;
