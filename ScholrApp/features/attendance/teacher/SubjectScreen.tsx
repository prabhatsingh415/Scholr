import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import useFetchSubjects from "@/src/hooks/teacher/useFetchSubjects";
import useGenerateQR from "@/src/hooks/attendance/useGenerateQR";
import useAttendanceSessionStore from "@/src/store/attendanceSessionStore";
import { useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";
import { ErrorCard } from "@/components/ui/ErrorCard";
import {
  BookOpen,
  MapPin,
  PlayCircle,
  GraduationCap,
} from "lucide-react-native";
import Loader from "@/components/ui/Loader";

const SubjectScreen = () => {
  const queryClient = useQueryClient();
  const setSession = useAttendanceSessionStore((state) => state.setSession);
  const { data: subjects, isLoading } = useFetchSubjects();
  const { mutate, isPending: generating } = useGenerateQR();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setShowError(true);
  };

  const handleGeneration = async (subject: any) => {
    try {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Location.requestForegroundPermissionsAsync();
        if (newStatus !== "granted") {
          triggerError(
            "Location is required to verify classroom presence. Please enable it in Settings."
          );
          return;
        }
      }

      let locationResult;
      try {
        locationResult = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      } catch (e) {
        triggerError("Unable to get GPS signal. Make sure location is ON.");
        return;
      }

      mutate(
        {
          subjectName: subject.subjectName,
          semester: subject.semester,
          topic: "Regular Lecture",
          teacherLat: locationResult.coords.latitude,
          teacherLng: locationResult.coords.longitude,
        },
        {
          onSuccess: (response) => {
            if (response?.data) {
              setSession(response.data.qrCodeBase64, response.data.session);
              queryClient.invalidateQueries({ queryKey: ["activeSession"] });
            } else {
              triggerError("Server failed to generate session. Try again.");
            }
          },
          onError: (error: any) => {
            const apiError =
              error?.response?.data?.message ||
              "Server error! Please try again.";
            triggerError(apiError);
          },
        }
      );
    } catch (error) {
      triggerError("Something went wrong! please try again later...");
    }
  };

  const SubBlock = ({ item }: any) => (
    <View className="bg-[#121212] p-6 rounded-[32px] mb-4 border border-white/5 shadow-2xl">
      <View className="flex-row justify-between items-start mb-4">
        <View className="bg-brand/10 p-3 rounded-2xl">
          <BookOpen size={24} color="#6366f1" />
        </View>
        <View className="bg-white/5 px-3 py-1 rounded-full">
          <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            Sem {item.semester || "N/A"}
          </Text>
        </View>
      </View>

      <Text className="text-white text-2xl font-bold tracking-tight mb-1">
        {item.subjectName}
      </Text>
      <View className="flex-row items-center mb-6">
        <GraduationCap size={14} color="#9CA3AF" />
        <Text className="text-gray-400 text-sm ml-2">
          {item.department || "General"}
        </Text>
      </View>

      <TouchableOpacity
        disabled={generating}
        onPress={() => handleGeneration(item)}
        activeOpacity={0.8}
        className={`flex-row items-center justify-center py-4 rounded-2xl ${
          generating ? "bg-gray-800" : "bg-brand"
        }`}
      >
        {generating ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <PlayCircle size={20} color="white" className="mr-2" />
            <Text className="text-white font-extrabold text-lg ml-2">
              Start Class
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-[#0A0A0A]">
      {generating && <Loader>Creating Secure Session...</Loader>}

      <View className="px-6 py-8">
        <Text className="text-gray-500 text-sm font-medium">
          Your Dashboard
        </Text>
        <Text className="text-white text-4xl font-black tracking-tighter">
          My <Text className="text-brand">Subjects</Text>
        </Text>
      </View>

      <FlatList
        data={subjects?.data}
        renderItem={({ item }) => <SubBlock item={item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center mt-20">
              <Text className="text-gray-500 text-lg">
                No subjects assigned yet.
              </Text>
            </View>
          ) : null
        }
      />

      <ErrorCard
        visible={showError}
        message={errorMessage}
        onClose={() => {
          setShowError(false);
          if (errorMessage.includes("Settings")) Linking.openSettings();
        }}
      />
    </View>
  );
};

export default SubjectScreen;
