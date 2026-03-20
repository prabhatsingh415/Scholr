import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useMemo, useState } from "react";
import { QrCode, Search, User, CheckCircle2 } from "lucide-react-native";
import useAttendanceSessionStore from "@/src/store/attendanceSessionStore";
import QRScreen from "../teacher/QRScreen";
import { useFetchStudentAttendance } from "@/src/hooks/teacher/useFetchStudentAttendance";

const AttendanceScreen = ({ session, role }: any) => {
  const [showQR, setShowQr] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { qrCode, subjectName, topic, subjectCode, semesterId, deptId } =
    useAttendanceSessionStore();

  console.log("🚀 PAYLOAD CHECK:", { subjectCode, semesterId, deptId });
  const {
    data: students,
    isPending,
    isError,
    refetch,
  } = useFetchStudentAttendance({
    subjectCode,
    semesterId,
    deptId,
  });

  const filteredStudents = useMemo(() => {
    const studentList = students?.data || [];
    return studentList.filter((student: any) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const collegeId = student.collegeId.toLowerCase();
      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        collegeId.includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, students]);

  const StudentCard = ({ item }: any) => (
    <View className="flex-row items-center bg-background-secondary/50 p-4 rounded-2xl mb-3 border border-white/5">
      <View className="w-12 h-12 rounded-full bg-brand/20 items-center justify-center">
        {item.profilePicURL ? (
          <Image
            source={{ uri: item.profilePicURL }}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <User size={24} color="#6366f1" />
        )}
      </View>

      <View className="flex-1 ml-4">
        <Text className="text-text-primary font-semibold text-base">
          {item.firstName} {item.lastName}
        </Text>
        <Text className="text-text-secondary text-xs uppercase">
          {item.collegeId}
        </Text>
      </View>

      <View className="items-end">
        <CheckCircle2 size={20} color="#22c55e" />
        <Text className="text-[10px] text-green-500 mt-1 font-bold">
          PRESENT
        </Text>
      </View>
    </View>
  );

  if (showQR) {
    return (
      <QRScreen
        subjectName={subjectName}
        semesterNo={session?.subject?.semester.semesterNo}
        qrCode={qrCode}
        topic={topic}
        setShowQr={setShowQr}
      />
    );
  }

  return (
    <View className="flex-1 bg-background-primary">
      <View className="pt-14 pb-6 px-6 bg-background-secondary/30 rounded-b-[40px]">
        <Text className="text-text-secondary text-sm font-medium">
          Active Session
        </Text>
        <Text className="text-2xl font-bold text-text-primary mb-4">
          {subjectName}
        </Text>

        <View className="flex-row items-center bg-background-primary/80 px-4 py-3 rounded-2xl border border-white/10">
          <Search size={20} color="#94a3b8" />
          <TextInput
            placeholder="Search students..."
            placeholderTextColor="#64748b"
            className="flex-1 ml-3 text-text-primary"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View className="flex-1 px-6 pt-6">
        {isPending ? (
          <ActivityIndicator size="large" color="#6366f1" className="mt-20" />
        ) : isError ? (
          <TouchableOpacity onPress={() => refetch()} className="mt-20">
            <Text className="text-red-500 text-center">
              Server Error! Tap to retry.
            </Text>
          </TouchableOpacity>
        ) : (
          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.userId.toString()}
            renderItem={({ item }) => <StudentCard item={item} />}
            ListEmptyComponent={
              <Text className="text-text-secondary text-center mt-10">
                No students in this class.
              </Text>
            }
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>

      <TouchableOpacity
        onPress={() => setShowQr(true)}
        className="bg-brand rounded-full w-16 h-16 absolute right-6 bottom-10 shadow-2xl justify-center items-center"
      >
        <QrCode size={30} color={"#ffffff"} />
      </TouchableOpacity>
    </View>
  );
};

export default AttendanceScreen;
