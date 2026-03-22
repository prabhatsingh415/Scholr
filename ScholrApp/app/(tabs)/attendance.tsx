import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import useUserStore from "@/src/store/userStore";
import { useSession } from "@/src/hooks/attendance/useSession";
import AttendanceScreen from "@/features/attendance/components/AttendanceScreen";
import { Role } from "@/types/user";
import Skeleton from "@/components/ui/Skeleton";
import SubjectScreen from "@/features/attendance/teacher/SubjectScreen";
import ScannerScreen from "@/features/attendance/student/ScannerScreen";
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

  const renderContent = () => {
    if (user?.role === Role.TEACHER) {
      return session ? (
        <AttendanceScreen role={Role.TEACHER} session={session} />
      ) : (
        <SubjectScreen />
      );
    }
    return <ScannerScreen />;
  };
  return (
    <SafeAreaView className="bg-background-primary flex-1">
      {renderContent()}
    </SafeAreaView>
  );
};

export default attendance;
