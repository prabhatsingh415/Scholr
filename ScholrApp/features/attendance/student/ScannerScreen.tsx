import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import DeviceInfo from "react-native-device-info";
import { Scan, X } from "lucide-react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import useMarkAttendance from "@/src/hooks/attendance/useMarkAttendance";
import Loader from "@/components/ui/Loader";
import { InfoCard } from "@/components/ui/InfoCard";
import { ErrorCard } from "@/components/ui/ErrorCard";

const ScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [infoVisible, setInfoVisible] = useState<boolean>(false);
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [localLoading, setLocalLoading] = useState<boolean>(false);

  const { mutate, isPending } = useMarkAttendance();

  if (!permission) {
    return <View className="flex-1 bg-background-primary" />;
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setIsScanning(false);

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
          deviceId: deviceId,
        },
        {
          onSuccess: (response) => {
            setLocalLoading(false);
            setInfoMessage("Attendance marked successfully!");
            setInfoVisible(true);
          },
          onError: (error: any) => {
            setLocalLoading(false);
            const msg =
              error.response?.data?.message ||
              "Failed to mark attendance. You might be too far from the classroom.";
            setErrorMessage(msg);
            setErrorVisible(true);
          },
        }
      );
    } catch (err) {
      setLocalLoading(false);
      setErrorMessage(
        "Could not fetch location. Please ensure GPS is enabled."
      );
      setErrorVisible(true);
    }
  };

  const startScanner = async () => {
    if (!permission.granted) {
      const status = await requestPermission();
      if (!status.granted) {
        setErrorMessage(
          "Camera access is required to scan the attendance QR code."
        );
        setErrorVisible(true);
        return;
      }
    }
    setIsScanning(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      {(isPending || localLoading) && <Loader>Verifying Attendance...</Loader>}

      <InfoCard visible={infoVisible} message={infoMessage} />

      <ErrorCard
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />

      {!isScanning ? (
        <>
          <Text className="text-2xl text-text-primary font-bold m-4">
            Mark Your Attendance
          </Text>

          <View className="flex-1 justify-center">
            <View className="bg-[#121212] p-8 rounded-[40px] items-center justify-center border border-white/5 shadow-2xl w-[90%] self-center">
              <View className="w-64 h-64 border-[3px] border-brand rounded-[45px] items-center justify-center mb-10 relative overflow-hidden">
                <Scan size={80} color="#6366f1" strokeWidth={1} opacity={0.2} />
              </View>

              <View className="items-center mb-10">
                <Text className="text-white text-2xl font-bold tracking-tight">
                  Scan QR Code
                </Text>
                <Text className="text-text-secondary text-sm mt-2 text-center">
                  Position the classroom QR code within the frame
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={startScanner}
                className="bg-brand py-4 px-12 rounded-2xl w-full items-center shadow-lg shadow-brand/20"
              >
                <Text className="text-white font-bold text-lg">
                  Start Scanning
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <View className="flex-1 bg-black">
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
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
