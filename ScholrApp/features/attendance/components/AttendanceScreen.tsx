import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Alert,
  Modal,
} from "react-native";
import React, { useMemo, useState } from "react";
import {
  QrCode,
  Search,
  User,
  CheckCircle2,
  Circle,
  XCircle,
  Power,
} from "lucide-react-native";
import useAttendanceSessionStore from "@/src/store/attendanceSessionStore";
import QRScreen from "../teacher/QRScreen";
import { useFetchStudentAttendance } from "@/src/hooks/teacher/useFetchStudentAttendance";
import useEndSession from "@/src/hooks/attendance/useEndSession";
import { useQueryClient } from "@tanstack/react-query";
import useManualAttendance from "@/src/hooks/attendance/useManualAttendance";
import { AttendanceStatus } from "@/types/attendance";
import Skeleton from "@/components/ui/Skeleton";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { InfoCard } from "@/components/ui/InfoCard";
import StudentAttendanceCard from "../student/StudentCard";
import { useRouter } from "expo-router";

const AttendanceScreen = ({ session }: any) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const clearSession = useAttendanceSessionStore(
    (state) => state.deleteSession
  );

  const [showQR, setShowQr] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Feedback States
  const [infoVisible, setInfoVisible] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEndModal, setShowEndModal] = useState(false);

  const { qrCode, subjectName, topic, subjectCode, semesterId, deptId } =
    useAttendanceSessionStore();

  // 1. Fetch Students
  const sessionId = session?.sessionId;
  const {
    data: students,
    isPending: loadingStudents,
    isError: fetchError,
    refetch,
  } = useFetchStudentAttendance({
    subjectCode,
    semesterId,
    deptId,
    sessionId,
  });

  // 2. Mutations
  const { mutate: toggle, isPending: toggling } = useManualAttendance();
  const { mutate: endSessionMutation, isPending: closing } = useEndSession();

  // Fuzzy Search Logic
  const filteredStudents = useMemo(() => {
    const studentList = students?.data || [];
    if (!searchQuery.trim()) return studentList;

    const query = searchQuery.toLowerCase().trim();
    const queryParts = query.split(" ");

    return studentList.filter((student: any) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const collegeId = student.collegeId.toLowerCase();
      return queryParts.every(
        (part) => fullName.includes(part) || collegeId.includes(part)
      );
    });
  }, [searchQuery, students]);

  const handleCloseSession = () => setShowEndModal(true);

  const summary = useMemo(() => {
    const list = students?.data || [];
    return {
      present: list.filter((s: any) => s.status === AttendanceStatus.PRESENT)
        .length,
      late: list.filter((s: any) => s.status === AttendanceStatus.LATE).length,
      absent: list.filter((s: any) => s.status === AttendanceStatus.ABSENT)
        .length,
    };
  }, [students]);

  const WarningModal = () => (
    <Modal visible={showEndModal} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/80 px-8">
        <View className="bg-[#121212] w-full p-8 rounded-[40px] border border-white/5 items-center">
          <View className="bg-red-500/10 p-5 rounded-full mb-6">
            <Power size={40} color="#EF4444" />
          </View>
          <Text className="text-white text-2xl font-black text-center mb-4">
            Close Session?
          </Text>
          <Text className="text-gray-400 text-center leading-6 mb-8">
            Warning: If you close this session now, you{" "}
            <Text className="text-red-500 font-bold">won't be able</Text> to
            manually mark attendance for remaining students later.
          </Text>

          <View className="flex-row gap-x-3 w-full">
            <TouchableOpacity
              onPress={() => setShowEndModal(false)}
              className="flex-1 bg-white/5 py-4 rounded-2xl border border-white/10 items-center"
            >
              <Text className="text-gray-300 font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={closing}
              onPress={() => {
                setShowEndModal(false);
                endSessionMutation(session?.sessionId, {
                  onSuccess: () => {
                    queryClient.invalidateQueries({
                      queryKey: ["activeSession"],
                    });

                    if (clearSession) {
                      clearSession();
                    }
                    setInfoMessage("Session ended successfully!");
                    setInfoVisible(true);
                  },
                });
              }}
              className="flex-1 bg-red-600 py-4 rounded-2xl items-center"
            >
              <Text className="text-white font-bold">
                {closing ? "Closing..." : "End Now"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const handleManualUpdate = (
    newStatus: AttendanceStatus,
    studentName: string,
    collegeId: string
  ) => {
    toggle(
      {
        collegeId: collegeId,
        sessionId: sessionId,
        status: newStatus,
      },
      {
        onSuccess: () => {
          setInfoMessage(`Updated ${studentName} to ${newStatus}`);
          setInfoVisible(true);
          setTimeout(() => setInfoVisible(false), 1500);
          queryClient.invalidateQueries({ queryKey: ["fetch-students"] });
          refetch();
        },
        onError: (err: any) => {
          setErrorMessage(
            err?.response?.data?.message || "Failed to update attendance"
          );
          setErrorVisible(true);
        },
      }
    );
  };

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
    <View className="flex-1 bg-[#0A0A0A]">
      <WarningModal />
      <View className="pt-14 pb-6 px-6 bg-[#121212] rounded-b-[40px] border-b border-white/5">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              Active Session
            </Text>
            <Text className="text-2xl font-black text-white">
              {subjectName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleCloseSession}
            disabled={closing}
            className="bg-red-500/10 p-3 rounded-2xl border border-red-500/20"
          >
            <Power size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between mb-6 bg-white/5 p-4 rounded-3xl border border-white/10">
          <View className="items-center flex-1">
            <Text className="text-green-500 font-black text-lg">
              {summary.present}
            </Text>
            <Text className="text-gray-500 text-[10px] font-bold uppercase">
              Present
            </Text>
          </View>
          <View className="items-center flex-1 border-x border-white/10">
            <Text className="text-yellow-500 font-black text-lg">
              {summary.late}
            </Text>
            <Text className="text-gray-500 text-[10px] font-bold uppercase">
              Late
            </Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-red-500 font-black text-lg">
              {summary.absent}
            </Text>
            <Text className="text-gray-500 text-[10px] font-bold uppercase">
              Absent
            </Text>
          </View>
        </View>

        <View className="flex-row items-center bg-[#1A1A1A] px-4 py-3 rounded-2xl border border-white/5">
          <Search size={20} color="#4B5563" />
          <TextInput
            placeholder="Search students..."
            placeholderTextColor="#4B5563"
            className="flex-1 ml-3 text-white font-medium"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View className="flex-1 px-6 pt-6">
        {loadingStudents ? (
          // List Skeleton
          <View>
            {[1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                className="flex-row items-center p-4 bg-[#1A1A1A] rounded-3xl mb-3 border border-white/5"
              >
                <Skeleton width={48} height={48} borderRadius={24} />
                <View className="ml-4 flex-1 gap-y-2">
                  <Skeleton width="60%" height={16} />
                  <Skeleton width="30%" height={10} />
                </View>
                <Skeleton width={24} height={24} borderRadius={12} />
              </View>
            ))}
          </View>
        ) : fetchError ? (
          <View className="mt-20 items-center">
            <XCircle size={40} color="#EF4444" />
            <Text className="text-white mt-4">Failed to load students</Text>
            <TouchableOpacity
              onPress={() => refetch()}
              className="mt-4 bg-brand px-6 py-2 rounded-xl"
            >
              <Text className="text-white font-bold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.userId.toString()}
            renderItem={({ item }) => (
              <StudentAttendanceCard
                item={item}
                onUpdateStatus={handleManualUpdate}
                disabled={toggling}
              />
            )}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <View className="flex-row justify-between mb-4 px-1">
                <Text className="text-gray-500 font-bold uppercase text-[10px]">
                  Student List
                </Text>
                <Text className="text-brand font-bold text-[10px]">
                  {filteredStudents.length} Students
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <View className="mt-20 items-center">
                <XCircle size={40} color="#374151" />
                <Text className="text-gray-500 text-center mt-4">
                  No matching students.
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 150 }}
          />
        )}
      </View>

      {/* QR Floating Button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setShowQr(true)}
        className="bg-brand rounded-3xl w-20 h-20 absolute right-6 bottom-14 shadow-2xl justify-center items-center"
      >
        <QrCode size={34} color={"#ffffff"} />
      </TouchableOpacity>

      <InfoCard visible={infoVisible} message={infoMessage} />
      <ErrorCard
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
    </View>
  );
};

export default AttendanceScreen;
