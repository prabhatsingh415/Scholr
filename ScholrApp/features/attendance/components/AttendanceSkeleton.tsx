import React from "react";
import { View } from "react-native";
import Skeleton from "@/components/ui/Skeleton";

const ProfileSkeleton = () => {
  return (
    <View className="px-4 mt-6 gap-8">
      <View className="flex-row items-center gap-4">
        <Skeleton width={80} height={80} borderRadius={40} />
        <View className="gap-2">
          <Skeleton width={150} height={20} />
          <Skeleton width={100} height={15} />
        </View>
      </View>

      <View className="gap-4">
        <Skeleton width="100%" height={250} borderRadius={24} />
      </View>

      <View className="gap-2">
        <Skeleton width={180} height={20} />
        <Skeleton width="100%" height={200} borderRadius={24} />
      </View>
    </View>
  );
};

export default ProfileSkeleton;
