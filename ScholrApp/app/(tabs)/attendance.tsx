import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import useUserStore from "@/src/store/userStore";
import { useSession } from "@/src/hooks/attendance/useSession";
import useAttendanceSessionStore from "@/src/store/attendanceSessionStore";
import AttendanceScreen from "@/features/attendance/components/AttendanceScreen";
import { Role } from "@/types/user";
import Skeleton from "@/components/ui/Skeleton";
import SubjectScreen from "@/features/attendance/teacher/SubjectScreen";

const attendance = () => {
  const user = useUserStore((state) => state.user);
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <SafeAreaView className="bg-background-primary flex-1 justify-center items-center">
        <Skeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-background-primary flex-1">
      {user?.role === Role.TEACHER
        ? (console.log("yahase 😭😭😭😭😭 ", session),
          session === null ? (
            <SubjectScreen />
          ) : (
            <AttendanceScreen role={Role.TEACHER} session={session} />
          ))
        : (console.log("yahase "), (<AttendanceScreen role={Role.STUDENT} />))}
    </SafeAreaView>
  );
};

export default attendance;
