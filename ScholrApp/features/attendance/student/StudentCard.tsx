import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { User } from "lucide-react-native";
import { AttendanceStatus } from "@/types/attendance";

interface StudentAttendanceCardProps {
  item: any;
  onUpdateStatus: (
    newStatus: AttendanceStatus,
    studentName: string,
    collegeId: string
  ) => void;
  disabled?: boolean;
}

const StudentAttendanceCard = ({
  item,
  onUpdateStatus,
}: StudentAttendanceCardProps) => {
  const currentStatus = item.status;

  return (
    <View className="bg-[#1A1A1A] p-4 rounded-3xl mb-3 border border-white/5 flex-row items-center">
      <View className="w-10 h-10 rounded-full bg-brand/10 items-center justify-center overflow-hidden border border-white/5">
        {item.profilePicURL ? (
          <Image source={{ uri: item.profilePicURL }} className="w-10 h-10" />
        ) : (
          <User size={20} color="#6366f1" />
        )}
      </View>

      <View className="flex-1 ml-3">
        <Text className="text-white font-bold text-sm" numberOfLines={1}>
          {item.firstName} {item.lastName}
        </Text>
        <Text className="text-gray-500 text-[10px] uppercase tracking-widest">
          {item.collegeId}
        </Text>
      </View>

      <View className="flex-row bg-black/40 p-1 rounded-2xl border border-white/5">
        <StatusOption
          label="P"
          active={currentStatus === "PRESENT"}
          activeCol="bg-green-500"
          onPress={() =>
            onUpdateStatus(
              AttendanceStatus.PRESENT,
              item.firstName,
              item.collegeId
            )
          }
        />
        <StatusOption
          label="L"
          active={currentStatus === "LATE"}
          activeCol="bg-yellow-500"
          onPress={() =>
            onUpdateStatus(
              AttendanceStatus.LATE,
              item.firstName,
              item.collegeId
            )
          }
        />
        <StatusOption
          label="A"
          active={currentStatus === "ABSENT"}
          activeCol="bg-red-500"
          onPress={() =>
            onUpdateStatus(
              AttendanceStatus.ABSENT,
              item.firstName,
              item.collegeId
            )
          }
        />
      </View>
    </View>
  );
};
const StatusOption = ({ label, active, activeCol, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className={`w-9 h-9 items-center justify-center rounded-xl ${active ? activeCol : "bg-transparent"}`}
  >
    <Text
      className={`font-black text-xs ${active ? "text-white" : "text-gray-600"}`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default StudentAttendanceCard;
