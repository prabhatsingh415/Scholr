import { View, Text, TouchableOpacity, Linking } from "react-native";
import { CalendarDays } from "lucide-react-native";
import React from "react";
import { Role } from "@/types";

const Meeting = ({ role, showInfo }: { role: Role; showInfo: () => void }) => {
  const isTeacher = role === "TEACHER";

  const liveClass = {
    is_active: true,
    topic: "Mobile App Development",
    time: "10:00 AM",
    meeting_link: "http//join-meeting.com",
  };

  return (
    <View className="px-4 w-full">
      <View className="bg-background-secondary p-5 border border-background-elevated rounded-2xl w-full">
        <View className="flex flex-row justify-between items-start mb-2">
          <View className="flex-1 mr-2">
            <Text className="font-bold text-xl text-text-primary leading-7">
              {liveClass.topic}
            </Text>
          </View>

          <View className="flex-row items-center bg-live-primary/10 px-3 py-1.5 rounded-full border border-live-primary/20">
            <View className="h-2 w-2 bg-live-primary rounded-full mr-2" />
            <Text className="text-live-primary text-xs font-bold">LIVE</Text>
          </View>
        </View>

        <View className="flex flex-row justify-start items-center gap-2 mb-4">
          <CalendarDays size={18} color={"#666666"} />
          <Text className="text-text-secondary text-base">
            {liveClass.time}
          </Text>
        </View>

        <TouchableOpacity
          onPress={showInfo}
          activeOpacity={0.7}
          className="bg-live-btn p-3 rounded-xl shadow-sm shadow-brand/20"
        >
          <Text className="text-white text-center font-bold text-base">
            {isTeacher ? "Start Meeting" : "Join Live Class"}
          </Text>
        </TouchableOpacity>

        {isTeacher && (
          <Text className="text-text-secondary text-xs text-center mt-2 italic">
            Make sure to record the session
          </Text>
        )}
      </View>
    </View>
  );
};
export default Meeting;
