import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Scan, X } from "lucide-react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

const ScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);

  if (!permission) {
    return <View className="flex-1 bg-background-primary" />;
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setIsScanning(false);
    console.log("QR Data extracted:", data);
    alert(`Scanned: ${data}`);
  };

  const startScanner = async () => {
    if (!permission.granted) {
      const status = await requestPermission();
      if (!status.granted) {
        alert("Camera permission is required!");
        return;
      }
    }
    setIsScanning(true);
  };

  if (isScanning) {
    return (
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
          <Text className="text-white mt-6 font-bold text-lg">
            Align QR Code within frame
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
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
              Position QR code in the frame
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={startScanner}
            className="bg-brand py-4 px-12 rounded-2xl w-full items-center shadow-lg shadow-brand/20"
          >
            <Text className="text-white font-bold text-lg">Start Scanning</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ScannerScreen;
