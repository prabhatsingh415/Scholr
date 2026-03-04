import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { UpdateNameFormProps } from "@/types";

const UpdateNameForm = ({
  firstName,
  lastName,
  onSubmitData,
  onCancel,
}: UpdateNameFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: { firstName: firstName, lastName: lastName },
  });
  return (
    <View className="w-full space-y-4 gap-6 mb-12 py-4">
      <Controller
        control={control}
        name="firstName"
        rules={{
          required: "First name is required",
          maxLength: 50,
          minLength: 3,
        }}
        render={({ field: { onChange, value, onBlur } }) => (
          <View className="flex-row items-center bg-background-secondary border border-border-subtle rounded-xl px-4 mb-2">
            <TextInput
              className="flex-1 p-4 text-text-primary"
              placeholderTextColor="#666666"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          </View>
        )}
      />

      {errors.firstName?.message ? (
        <Text className="text-red-500 mb-2 ml-1 text-xs">
          {String(errors.firstName.message)}
        </Text>
      ) : null}

      <Controller
        control={control}
        name="lastName"
        rules={{
          required: "Last name is required",
          maxLength: 50,
          minLength: 3,
        }}
        render={({ field: { onChange, value, onBlur } }) => (
          <View className="flex-row items-center bg-background-secondary border border-border-subtle rounded-xl px-4 mb-2">
            <TextInput
              className="flex-1 p-4 text-text-primary"
              placeholderTextColor="#666666"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          </View>
        )}
      />
      {errors.lastName?.message ? (
        <Text className="text-red-500 mb-2 ml-1 text-xs leading-5">
          {String(errors.lastName.message)}
        </Text>
      ) : null}

      <View className="w-full flex flex-row gap-8 justify-center items-center">
        <TouchableOpacity
          className={`w-1/2 ${!isDirty ? "bg-background-secondary" : "bg-brand"}  p-4 rounded-xl items-center `}
          onPress={handleSubmit(onSubmitData)}
          disabled={!isDirty}
        >
          <Text className="text-text-primary font-bold text-lg">Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-1/2 bg-background-box p-4 rounded-xl items-center "
          onPress={handleSubmit(onCancel)}
        >
          <Text className="text-text-primary font-bold text-lg">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UpdateNameForm;
