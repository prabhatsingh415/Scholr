import { View, Text, FlatList, TouchableOpacity, Linking } from "react-native";
import React, { useState } from "react";
import useFetchSubjects from "@/src/hooks/teacher/useFetchSubjects";
import useGenerateQR from "@/src/hooks/attendance/useGenerateQR";
import useAttendanceSessionStore from "@/src/store/attendanceSessionStore";
import { useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";
import { ErrorCard } from "@/components/ui/ErrorCard";

const SubjectScreen = () => {
  const queryClient = useQueryClient();
  const setSession = useAttendanceSessionStore((state) => state.setSession);
  const { data: subjects } = useFetchSubjects();
  const { mutate, isPending: generating } = useGenerateQR();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setShowError(true);
  };

  const handleGeneration = async (subject: any) => {
    try {
      let { status, canAskAgain } =
        await Location.getForegroundPermissionsAsync();

      if (status !== "granted") {
        if (canAskAgain) {
          const { status: newStatus } =
            await Location.requestForegroundPermissionsAsync();
          if (newStatus !== "granted") {
            triggerError(
              "Location access denied! Location is required for Attendance."
            );
            return;
          }
        } else {
          triggerError(
            "Location permission is denied ! click below to mannually change the permission."
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
        triggerError("Unable to get your location ! check your GPS settings");
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
              triggerError("Something went wrong ! please try again later...");
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
      triggerError("Something went wrong ! please try again later...");
    }
  };

  const SubBlock = ({ item }: any) => (
    <View className="p-4 border-b border-gray-200">
      <Text className="text-text-primary text-lg font-bold">
        {item.subjectName}
      </Text>
      <Text className="text-text-secondary">Semester: {item.semester}</Text>
      <TouchableOpacity
        disabled={generating}
        onPress={() => handleGeneration(item)}
        className={`p-2 mt-2 rounded ${generating ? "bg-gray-400" : "bg-blue-500"}`}
      >
        <Text className="text-white text-center">
          {generating ? "Generating..." : "Start Class"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-background-primary">
      <Text className="text-3xl text-text-primary p-4">Subjects</Text>
      <FlatList
        data={subjects?.data}
        renderItem={({ item }) => <SubBlock item={item} />}
        keyExtractor={(item) => item.subjectName}
        ListEmptyComponent={
          <Text className="p-4 text-text-secondary">No subjects found.</Text>
        }
      />

      <ErrorCard
        visible={showError}
        message={errorMessage}
        onClose={() => {
          setShowError(false);
          if (errorMessage.includes("Settings")) {
            Linking.openSettings();
          }
        }}
      />
    </View>
  );
};

export default SubjectScreen;
