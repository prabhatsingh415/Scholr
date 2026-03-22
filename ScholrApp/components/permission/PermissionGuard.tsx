import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { useCameraPermissions } from "expo-camera";
import {
  getMessaging,
  requestPermission,
} from "@react-native-firebase/messaging";

export const PermissionGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cameraPermission, requestCamera] = useCameraPermissions();
  const [status, setStatus] = useState<"loading" | "granted" | "denied">(
    "loading"
  );

  const askEverything = async () => {
    try {
      // Check & Request Camera Permission
      let cam = cameraPermission;
      if (!cam?.granted) {
        cam = await requestCamera();
      }

      // Check & Request Location Permission (Required for Attendance)
      const loc = await Location.requestForegroundPermissionsAsync();

      // Request Notification Permission
      const messaging = getMessaging();
      const authStatus = await requestPermission(messaging);

      if (cam?.granted && loc.status === "granted" && authStatus >= 1) {
        setStatus("granted");
      } else {
        setStatus("denied");
      }
    } catch (e) {
      console.error("Permission Request Error:", e);
      setStatus("denied");
    }
  };

  useEffect(() => {
    askEverything();
  }, []);

  if (status === "loading") {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0A0A0A",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (status === "denied") {
    return (
      <View className="flex-1 bg-[#0A0A0A] justify-center items-center p-8">
        <View className="mb-8 items-center">
          <Text className="text-white text-3xl font-bold mb-4">
            Permissions Required
          </Text>
          <Text className="text-gray-400 text-center text-base leading-6">
            To ensure secure and accurate attendance, Scholr requires access to
            your
            <Text className="text-brand font-bold"> Camera</Text>,
            <Text className="text-brand font-bold"> Location</Text>, and
            <Text className="text-brand font-bold"> Notifications</Text>.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => Linking.openSettings()}
          className="bg-brand py-4 px-10 rounded-2xl w-full items-center shadow-lg shadow-brand/20"
        >
          <Text className="text-white font-bold text-lg">
            Open System Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={askEverything} className="mt-6">
          <Text className="text-gray-500 font-medium">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
};
