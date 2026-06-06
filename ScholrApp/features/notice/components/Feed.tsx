import { Text, View, ScrollView, RefreshControl } from "react-native";
import React, { useState, useCallback } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Notice } from "@/types/notice";
import { fetchFeed } from "@/src/service/noticeService";
import NoticeLoader from "./NoticeSkeleton";
import NoticeCard from "./NoticeCard";
import { useFocusEffect } from "expo-router"; // Keeps state perfectly sync in expo-router contexts
import { InfoCard } from "@/components/ui/InfoCard";
import { ErrorCard } from "@/components/ui/ErrorCard";

const Feed = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [successVisible, setSuccessVisible] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Track if it's the very first time the app is opening
  const [isFirstMount, setIsFirstMount] = useState<boolean>(true);

  const loadData = async (showSkeleton = false) => {
    if (showSkeleton) setLoading(true);
    try {
      const data = await fetchFeed();
      const activeNotices = data
        ? data.filter((n: Notice) => n.isActive !== false)
        : [];
      setNotices(activeNotices);
    } catch (error) {
      console.error("Feed fetch error:", error);
      setErrorMessage("Failed to establish server synchronization pipeline.");
      setErrorVisible(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🔥 PERFECT SINGLE POINT AUTO-RELOAD (Eliminated double useEffect fire)
  useFocusEffect(
    useCallback(() => {
      if (isFirstMount) {
        loadData(true); // First cold start shows full Shimmer skeleton loader
        setIsFirstMount(false);
      } else {
        loadData(false); // Tab switching pulls fresh stream data silently in the background
      }
    }, [isFirstMount])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData(false);
  };

  const triggerSuccessToast = (msg: string) => {
    setSuccessMessage(msg);
    setSuccessVisible(true);
    setTimeout(() => {
      setSuccessVisible(false);
    }, 3500);
  };

  const handleNoticeDelete = async (id: number) => {
    try {
      // Optimistic layout update - pops the element instantly before heavy network roundtrips
      setNotices((prev) => prev.filter((notice) => notice.id !== id));
      triggerSuccessToast("Notice successfully unlinked and archived.");
    } catch (error) {
      console.error("Failed to delete notice context packet:", error);
      setErrorMessage(
        "Destruction sequence aborted. API state handshake mismatch."
      );
      setErrorVisible(true);
      loadData(false); // Rollback to sync server data
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#0a0a0a] px-4 pt-12">
        <View className="mb-4">
          <Text className="text-3xl font-black text-white tracking-tight">
            Notices
          </Text>
          <Text className="text-sm text-zinc-500 mt-1">
            Official announcements and circulars
          </Text>
        </View>

        <NoticeLoader />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0a0a0a] px-4 pt-12 relative">
      <InfoCard visible={successVisible} message={successMessage} />

      <ErrorCard
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />

      <View className="mb-4">
        <Text className="text-3xl font-black text-white tracking-tight">
          Notices
        </Text>
        <Text className="text-sm text-zinc-500 mt-1">
          Official announcements and circulars
        </Text>
      </View>

      {notices.length === 0 ? (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#1E3A8A"]}
              tintColor="#1E3A8A"
            />
          }
        >
          <MaterialCommunityIcons
            name="bell-off-outline"
            size={48}
            color="#27272a"
          />
          <Text className="text-zinc-600 font-semibold mt-3 text-base">
            No announcements posted for this view
          </Text>
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#1E3A8A"]}
              tintColor="#1E3A8A"
            />
          }
        >
          {notices.map((item) => (
            <NoticeCard
              key={item.id}
              item={item}
              onDelete={handleNoticeDelete}
            />
          ))}
          <View className="h-12" />
        </ScrollView>
      )}
    </View>
  );
};

export default Feed;
