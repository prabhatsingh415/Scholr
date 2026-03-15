import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { QrCode, X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAttendanceSessionStore from "@/src/store/attendanceSessionStore";

const AttendanceScreen = ({ session, role }: any) => {
  const [showQR, setShowQr] = useState<boolean>(false);
  const { qrCode, subjectName, topic } = useAttendanceSessionStore();

  const QrIcon = () => (
    <View className="flex justify-center items-center bg-brand rounded-full w-20 h-20 absolute right-6 bottom-16 shadow-xl">
      <TouchableOpacity onPress={() => setShowQr(true)}>
        <QrCode size={40} color={"#ffffff"} />
      </TouchableOpacity>
    </View>
  );

  if (showQR) {
    return (
      <SafeAreaView className="mb-8 flex-1 bg-background-primary px-4 justify-center">
        <View className="bg-background-secondary p-6 rounded-[40px] shadow-2xl items-center">
          <Text className="text-text-primary text-2xl font-bold mb-1">
            Attendance QR Code
          </Text>
          <Text className="text-text-secondary text-base mb-1">
            {subjectName}
          </Text>
          <Text className="text-text-secondary text-sm mb-6">
            Semester {session?.subject?.semester.semesterNo || "Nil"}
          </Text>

          <View className="bg-background-primary p-4 rounded-3xl border border-gray-800">
            {qrCode ? (
              <Image
                source={{ uri: `data:image/png;base64,${qrCode}` }}
                style={{ width: 250, height: 250 }}
                resizeMode="contain"
              />
            ) : (
              <View
                style={{ width: 250, height: 250 }}
                className="justify-center items-center"
              >
                <Text className="text-red-500">QR Not Found</Text>
              </View>
            )}
          </View>

          <View className="w-full mt-6 bg-background-primary/50 p-4 rounded-2xl">
            <View className="flex-row justify-between mb-2">
              <Text className="text-text-secondary">Topic:</Text>
              <Text className="text-text-primary font-medium">
                {topic || "N/A"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-text-secondary">Generated:</Text>
              <Text className="text-text-primary font-medium">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>

          <Text className="text-text-secondary text-center text-xs mt-6 px-4">
            Students can scan this QR code to mark their attendance
            automatically.
          </Text>

          <TouchableOpacity
            onPress={() => setShowQr(false)}
            className="bg-brand w-full py-4 rounded-2xl mt-8 flex-row justify-center items-center"
          >
            <Text className="text-white font-bold text-lg">Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-background-primary justify-center items-center">
      <View className="items-center">
        <Text className="text-text-secondary text-lg mb-2">Active Session</Text>
        <Text className="text-4xl font-bold text-text-primary text-center px-6">
          {session?.subject?.subjectName}
        </Text>
        <View className="bg-brand/10 px-4 py-1 rounded-full mt-4">
          <Text className="text-brand font-medium uppercase tracking-widest">
            {role}
          </Text>
        </View>
      </View>

      <QrIcon />
    </View>
  );
};

export default AttendanceScreen;
