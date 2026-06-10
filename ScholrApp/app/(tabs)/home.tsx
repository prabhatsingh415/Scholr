import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import useUserStore from "@/src/store/userStore";
import Meeting from "@/features/home/components/DailyInsights";
import QuickAccess from "@/features/home/components/QuickAccess";
import Skeleton from "@/components/ui/Skeleton";
import { InfoCard } from "@/components/ui/InfoCard";

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

      <View className="px-4 py-4">
        <Text className="text-text-primary font-extralight text-3xl">
          Welcome
        </Text>
        {userDetails ? (
          <Text className="text-text-primary font-normal text-3xl">
            {userDetails.firstName} {userDetails.lastName}
          </Text>
        ) : (
          <Skeleton width={180} height={30} borderRadius={8} className="mt-2" />
        )}
      </View>
      <Meeting />
      <QuickAccess showInfo={() => setInfo(true)} />
    </SafeAreaView>
  );
};

export default home;
