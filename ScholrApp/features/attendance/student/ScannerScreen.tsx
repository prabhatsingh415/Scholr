import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import DeviceInfo from "react-native-device-info";
import {
  Scan,
  X,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Settings,
} from "lucide-react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import useMarkAttendance from "@/src/hooks/attendance/useMarkAttendance";
import Loader from "@/components/ui/Loader";
import { ErrorCard } from "@/components/ui/ErrorCard";
import useTodayAttendance from "@/src/hooks/attendance/useTodayAttendance";
import { useQueryClient } from "@tanstack/react-query";
import useUserStore from "@/src/store/userStore";

const ScannerScreen = () => {
  const queryClient = useQueryClient();
  const [permission, _] = useCameraPermissions();
  const user = useUserStore((state) => state.user);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [localLoading, setLocalLoading] = useState<boolean>(false);

  const { data: history, isLoading: historyLoading } = useTodayAttendance();
  const { mutate, isPending } = useMarkAttendance();

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!permission) {
    return (
      <View className="flex-1 bg-[#0A0A0A] justify-center items-center">
        <Loader children="Checking Camera..." />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-[#0A0A0A] justify-center items-center px-8">
        <View className="bg-red-500/10 p-6 rounded-full mb-6">
          <ShieldAlert size={50} color="#EF4444" strokeWidth={1.5} />
        </View>

        <Text className="text-white text-2xl font-bold text-center mb-3">
          Camera Access Revoked
        </Text>

        <Text className="text-gray-400 text-center mb-10 leading-6">
          Camera is required for attedance
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => Linking.openSettings()}
          className="bg-brand py-4 px-10 rounded-2xl w-full flex-row justify-center items-center"
        >
          <Settings size={20} color="white" className="mr-2" />
          <Text className="text-white font-bold text-lg ml-2">
            Open System Settings
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setIsScanning(false);
    setLocalLoading(true);

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const deviceId = await DeviceInfo.getUniqueId();

      mutate(
        {
          studentLat: location.coords.latitude,
          studentLng: location.coords.longitude,
          token: data,
          deviceId,
        },
        {
          onSuccess: () => {
            setLocalLoading(false);
            setIsSuccess(true);
            queryClient.invalidateQueries({ queryKey: ["todayAttendance"] });

            setTimeout(() => setIsSuccess(false), 5000);
          },
          onError: (error: any) => {
            setLocalLoading(false);
            setErrorMessage(
              error.response?.data?.message || "Verification failed."
            );
            setErrorVisible(true);
          },
        }
      );
    } catch (err) {
      setLocalLoading(false);
      setErrorMessage("GPS Error: Please enable location.");
      setErrorVisible(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0A]">
      {(isPending || localLoading || historyLoading) && (
        <Loader>Processing...</Loader>
      )}
      <ErrorCard
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />

      {!isScanning ? (
        <ScrollView className="flex-1 px-5">
          <View className="py-6">
            <Text className="text-gray-500 text-sm font-medium">
              {formattedDate}
            </Text>
            <Text className="text-white text-3xl font-bold">
              Hello, {user?.firstName}
            </Text>
          </View>

          <View className="bg-[#1A1A1A] p-5 rounded-3xl border border-white/5 mb-6">
            <Text className="text-gray-400 text-xs font-semibold uppercase">
              Total Sessions Today
            </Text>
            <View className="flex-row items-baseline mt-2">
              <Text className="text-white text-4xl font-bold">
                {history?.data?.length || 0}
              </Text>
              <Text className="text-brand ml-2 font-bold text-lg">Classes</Text>
            </View>
          </View>

          <View className="bg-[#121212] p-8 rounded-[40px] items-center justify-center border border-white/5 shadow-2xl mb-8">
            {isSuccess ? (
              <View className="items-center py-4">
                <View className="w-64 h-64 border-2 border-green-500/30 rounded-[45px] items-center justify-center mb-6 bg-green-500/5">
                  <CheckCircle2 size={100} color="#10B981" strokeWidth={1.5} />
                </View>
                <Text className="text-white text-2xl font-bold">
                  Attendance Marked!
                </Text>
                <Text className="text-gray-500 mt-2">
                  Successfully marked present
                </Text>
              </View>
            ) : (
              <>
                <View className="w-64 h-64 border-[3px] border-brand rounded-[45px] items-center justify-center mb-8 relative overflow-hidden bg-brand/5">
                  <Scan
                    size={80}
                    color="#6366f1"
                    strokeWidth={1}
                    opacity={0.3}
                  />
                </View>
                <View className="items-center mb-8">
                  <Text className="text-white text-2xl font-bold">
                    Scan QR Code
                  </Text>
                  <Text className="text-gray-500 text-sm mt-2 text-center">
                    Position QR code in the frame
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsScanning(true)}
                  className="bg-brand py-4 px-12 rounded-2xl w-full items-center shadow-lg shadow-brand/20"
                >
                  <Text className="text-white font-bold text-lg">
                    Start Scanning
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View className="mb-10">
            <Text className="text-white text-xl font-bold mb-4">
              Verification History
            </Text>
            {history?.data && history.data.length > 0 ? (
              history.data.map((item: any, index: number) => (
                <View
                  key={index}
                  className="bg-[#1A1A1A] p-4 rounded-2xl mb-3 flex-row items-center border border-white/5"
                >
                  <View className="bg-green-500/10 p-3 rounded-xl mr-4">
                    <CheckCircle2 size={20} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold">
                      {item.subjectName}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {item.markedAt.split(" ")[1].substring(0, 5)} PM
                    </Text>
                  </View>
                  <Text className="text-green-500 font-bold text-[10px]">
                    PRESENT
                  </Text>
                </View>
              ))
            ) : (
              <View className="p-10 items-center">
                <Text className="text-gray-500">
                  No attendance records for today.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 bg-black">
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={handleBarCodeScanned}
          />
          <TouchableOpacity
            onPress={() => setIsScanning(false)}
            className="absolute top-14 right-6 bg-black/50 p-3 rounded-full"
          >
            <X size={30} color="white" />
          </TouchableOpacity>

          <View className="flex-1 justify-center items-center">
            <View className="w-64 h-64 border-2 border-brand rounded-3xl" />
            <Text className="text-white mt-6 font-bold text-lg bg-black/40 px-4 py-2 rounded-lg">
              Align QR Code within frame
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ScannerScreen;
