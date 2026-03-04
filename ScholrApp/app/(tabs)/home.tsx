import { Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useUserStore from "@/src/store/userStore";
import UpcomingAndNotices from "@/features/home/student/upComingAndNotice";
import Meeting from "@/features/home/components/Meeting";
import QuickAccess from "@/features/home/components/QuickAccess";
import Skeleton from "@/components/ui/Skeleton";
import { InfoCard } from "@/components/ui/InfoCard";
import { Role } from "@/types";

const home = () => {
  const userDetails = useUserStore((state: any) => state.user);
  const [info, setInfo] = useState(false);

  useEffect(() => {
    if (!info) return;

    let timer = setTimeout(() => {
      setInfo(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [info]);

  return (
    <SafeAreaView className="bg-background-primary flex flex-1">
      <InfoCard
        message={`This is MVP phase \n We are working on the functionality !`}
        visible={info}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-4 py-6">
          <Text className="text-text-primary font-extralight text-3xl">
            Welcome
          </Text>
          {userDetails ? (
            <Text className="text-text-primary font-normal text-3xl">
              {userDetails.firstName} {userDetails.lastName}
            </Text>
          ) : (
            <Skeleton
              width={180}
              height={30}
              borderRadius={8}
              className="mt-2"
            />
          )}
        </View>
        <Meeting role={userDetails?.role} showInfo={() => setInfo(true)} />
        <QuickAccess role={userDetails?.role} showInfo={() => setInfo(true)} />

        {userDetails?.role === Role.STUDENT ? (
          <UpcomingAndNotices showInfo={() => setInfo(true)} />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default home;
