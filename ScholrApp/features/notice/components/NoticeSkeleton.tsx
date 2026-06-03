import { View, ScrollView } from "react-native";
import React from "react";
import Skeleton from "../../../components/ui/Skeleton";

const NoticeCardSkeleton = () => {
  return (
    <View className="bg-[#121212] border border-zinc-900/80 rounded-2xl p-4 mb-4 shadow-xl shadow-black/40">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center flex-1">
          <Skeleton width={38} height={38} borderRadius={12} />
          <View className="ml-3 flex-1 gap-y-2">
            <Skeleton width="85%" height={16} borderRadius={4} />
            <Skeleton width="45%" height={12} borderRadius={4} />
          </View>
        </View>
        <View className="items-end ml-2 gap-y-2">
          <View className="flex-row items-center gap-x-1.5">
            <Skeleton width={55} height={18} borderRadius={9999} />
            <Skeleton width={24} height={24} borderRadius={6} />
          </View>
          <Skeleton width={40} height={14} borderRadius={6} />
        </View>
      </View>

      <View className="pl-12 mb-4">
        <Skeleton width={90} height={10} borderRadius={4} />
      </View>

      <View className="pl-1 gap-y-2 mb-2">
        <Skeleton width="100%" height={14} borderRadius={4} />
        <Skeleton width="92%" height={14} borderRadius={4} />
      </View>

      <View className="mt-2 pl-1">
        <Skeleton width="100%" height={190} borderRadius={16} />
      </View>

      <View className="border-t border-zinc-900 mt-4 pt-3 items-center justify-center">
        <Skeleton width={100} height={12} borderRadius={4} />
      </View>
    </View>
  );
};

const NoticeLoader = () => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <NoticeCardSkeleton />
      <NoticeCardSkeleton />
      <NoticeCardSkeleton />
    </ScrollView>
  );
};

export default NoticeLoader;
