import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect } from "react";
import { Settings } from "lucide-react-native";
import ProfileDetails from "@/features/profile/components/ProfileDetails";
import AttendanceTrend from "@/features/profile/student/AttendenceTrend";
import { useProfile } from "@/src/hooks/user/useProfile";
import { useFocusEffect, useRouter } from "expo-router";
import useUserStore from "@/src/store/userStore";
import ProfileSkeleton from "@/features/profile/components/ProfileSkeleton";

const profile = () => {
  const { isPending, data, isError, error, refetch } = useProfile();
  const router = useRouter();

  const setData = useUserStore((state) => state.setData);

  useEffect(() => {
    if (data?.success && data?.data) {
      setData(data.data);
    }
  }, [data, setData]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );
  return (
    <SafeAreaView className="bg-background-primary flex flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-4 pt-4 flex flex-row justify-between">
          <View>
            <Text className="text-text-primary font-extralight text-3xl">
              Profile
            </Text>
            <Text className="text-text-secondary font-normal text-md">
              Your academic overview
            </Text>
          </View>

          <View>
            <Settings
              size={25}
              color={"#FAFAFA"}
              style={{
                marginTop: 12,
                marginRight: 2,
              }}
              onPress={() => router.push("/settings")}
            />
          </View>
        </View>

        {isPending ? (
          <ProfileSkeleton />
        ) : (
          <>
            <ProfileDetails userData={data} isError={isError} error={error} />

            {!isError && data?.data?.role === "STUDENT" && <AttendanceTrend />}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;
