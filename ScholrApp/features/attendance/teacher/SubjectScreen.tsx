import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import useFetchSubjects from "@/src/hooks/teacher/useFetchSubjects";
import useGenerateQR from "@/src/hooks/attendance/useGenerateQR";
import useAttendanceSessionStore from "@/src/store/attendanceSessionStore";
import { useQueryClient } from "@tanstack/react-query";

const SubjectScreen = () => {
  const queryClient = useQueryClient(); // 👈 2. Hook initialize kar
  const setSession = useAttendanceSessionStore((state) => state.setSession);
  const session = useAttendanceSessionStore((state) => state.qrCode);
  const { data: subjects } = useFetchSubjects();
  const { mutate, isPending: generating } = useGenerateQR();

  console.log("subject dekh bhai ", subjects);
  console.log("QR -> ", session);

  const handleGeneration = (subject: any) => {
    mutate(
      {
        subjectName: subject.subjectName,
        semester: subject.semester,
        topic: "Regular Lecture",
        teacherLat: 26.123,
        teacherLng: 75.123,
      },
      {
        onSuccess: (response) => {
          if (response?.data) {
            setSession(response.data.qrCodeBase64, response.data.session);
            queryClient.invalidateQueries({ queryKey: ["activeSession"] });
          } else {
            console.error("Backend ne data nahi bheja bhai!", response);
          }
        },
      }
    );
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
        className="bg-blue-500 p-2 mt-2 rounded"
      >
        <Text className="text-white text-center">
          {generating ? "Generating..." : "Start Class"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Text className="text-3xl text-text-primary">Subjects </Text>
      <FlatList
        data={subjects?.data}
        renderItem={({ item }) => <SubBlock item={item} />}
        keyExtractor={(item) => item.subjectName}
      />
    </>
  );
};

export default SubjectScreen;
