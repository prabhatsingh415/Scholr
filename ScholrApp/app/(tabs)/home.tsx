import {
  Text,
  View,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useUserStore from "@/src/store/userStore";
import UpcomingAndNotices from "@/features/home/student/upComingAndNotice";
import { Role } from "@/types";
import Meeting from "@/features/home/components/Meeting";
import QuickAccess from "@/features/home/components/QuickAccess";
import useAuthStore from "@/src/store/authStore";

const home = () => {
  const userDetails = useUserStore((state: any) => state.user);
  const { auth } = useAuthStore();

  console.log("token", auth?.access_token);
  return (
    <SafeAreaView className="bg-background-primary flex flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-4 py-6">
          <Text className="text-text-primary font-extralight text-3xl">
            Welcome
          </Text>
          <Text className="text-text-primary font-normal text-3xl">
            {userDetails?.firstName} {userDetails?.lastName}
          </Text>
        </View>
        <Meeting role={Role.STUDENT} />
        <QuickAccess role={Role.STUDENT} />
        <UpcomingAndNotices />
      </ScrollView>
    </SafeAreaView>
  );
};

export default home;
