import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Notice, NoticeCategory } from "@/types/notice";
import { fetchFeed } from "@/src/service/noticeService";

// 🎨 Helper: Get dynamic styling based on Enum Categories
const getCategoryMeta = (category: any) => {
  // Handles both string and enum numeric evaluations
  const catString = String(category).toUpperCase();

  switch (catString) {
    case "EXAM":
    case "0":
      return {
        label: "Exam",
        color: "#f43f5e",
        bg: "bg-rose-950/30",
        border: "border-rose-900/50",
        icon: "file-document-edit-outline",
      };
    case "EVENT":
    case "1":
      return {
        label: "Event",
        color: "#a855f7",
        bg: "bg-purple-950/30",
        border: "border-purple-900/50",
        icon: "calendar-star",
      };
    case "HOLIDAY":
    case "2":
      return {
        label: "Holiday",
        color: "#eab308",
        bg: "bg-yellow-950/25",
        border: "border-yellow-900/40",
        icon: "island",
      };
    case "FEES":
    case "3":
      return {
        label: "Fees",
        color: "#3b82f6",
        bg: "bg-blue-950/30",
        border: "border-blue-900/50",
        icon: "credit-card-outline",
      };
    case "ACADEMIC":
    case "4":
      return {
        label: "Academic",
        color: "#10b981",
        bg: "bg-emerald-950/30",
        border: "border-emerald-900/50",
        icon: "school-outline",
      };
    default:
      return {
        label: "General",
        color: "#71717a",
        bg: "bg-zinc-800/40",
        border: "border-zinc-700/50",
        icon: "bell-outline",
      };
  }
};

// 🕒 Helper: Format ISO String to Human Readable
const formatTime = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recent";
  }
};

const Feed = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const data = await fetchFeed();
      // Filter out inactive items if any configuration demands it
      const activeNotices = data
        ? data.filter((n: Notice) => n.isActive !== false)
        : [];
      setNotices(activeNotices);
    } catch (error) {
      console.error("Feed fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#0a0a0a] justify-center items-center">
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0a0a0a] px-4 pt-12">
      {/* Dynamic Screen Header */}
      <View className="mb-6">
        <Text className="text-3xl font-black text-white tracking-tight">
          Notices
        </Text>
        <Text className="text-sm text-zinc-500 mt-1">
          Official announcements and circulars
        </Text>
      </View>

      {/* Empty State Handler */}
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
            No announcements posted yet
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
          {notices.map((item) => {
            const [expanded, setExpanded] = useState(false);
            const meta = getCategoryMeta(item.category);

            return (
              <View
                key={item.id}
                className="bg-[#121212] border border-zinc-900/80 rounded-2xl p-4 mb-4 shadow-xl shadow-black/40"
              >
                {/* Upper Deck: Metadata Info */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-row items-center flex-1">
                    {/* Dynamic Category Icon Container */}
                    <View
                      className={`p-2.5 rounded-xl ${meta.bg} border ${meta.border}`}
                    >
                      <MaterialCommunityIcons
                        name={meta.icon as any}
                        size={18}
                        color={meta.color}
                      />
                    </View>

                    <View className="ml-3 flex-1">
                      <Text
                        className="text-base font-bold text-zinc-100 tracking-tight leading-5"
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                      <Text className="text-xs text-zinc-400 font-medium mt-1">
                        By {item.Author?.firstName || "Faculty"}{" "}
                        {item.Author?.lastName || ""}
                      </Text>
                    </View>
                  </View>

                  {/* Status Badges Stack */}
                  <View className="items-end ml-2 gap-1.5">
                    <View
                      className={`px-2.5 py-0.5 rounded-full border ${meta.bg} ${meta.border}`}
                    >
                      <Text
                        className="text-[10px] font-black uppercase tracking-wider"
                        style={{ color: meta.color }}
                      >
                        {meta.label}
                      </Text>
                    </View>
                    {item.department?.deptId ? (
                      <View className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800">
                        <Text className="text-[9px] text-zinc-500 font-bold uppercase">
                          {item.department.deptId}
                        </Text>
                      </View>
                    ) : (
                      <View className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800">
                        <Text className="text-[9px] text-blue-400/80 font-bold uppercase">
                          All
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Sub-header Context Details */}
                <Text className="text-[11px] text-zinc-600 font-bold mb-3 pl-12">
                  Issued • {formatTime(item.createdAt)}
                </Text>

                {/* Main Body Content Description */}
                <Text
                  numberOfLines={expanded ? undefined : 2}
                  className="text-sm text-zinc-300 leading-relaxed pl-1"
                >
                  {item.content}
                </Text>

                {/* Media Link Asset Frame (Matches your Image Requirement) */}
                {item.contentLink ? (
                  <View className="mt-3 rounded-xl overflow-hidden border border-zinc-900">
                    <Image
                      source={{ uri: item.contentLink }}
                      className="w-full h-44"
                      resizeMode="cover"
                    />
                  </View>
                ) : null}

                {/* Custom Card Expand Trigger */}
                <TouchableOpacity
                  onPress={() => setExpanded(!expanded)}
                  className="flex-row items-center justify-center mt-3 pt-3 border-t border-zinc-900"
                >
                  <Text className="text-xs font-bold text-[#3b82f6]">
                    {expanded ? "Collapse notice" : "Read full notice"}
                  </Text>
                  <Feather
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={13}
                    color="#3b82f6"
                    style={{ marginLeft: 3 }}
                  />
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Bottom padding spacing for clean layouts */}
          <View className="h-12" />
        </ScrollView>
      )}
    </View>
  );
};

export default Feed;
