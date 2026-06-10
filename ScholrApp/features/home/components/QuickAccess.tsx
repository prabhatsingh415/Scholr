import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { MessageCircleMore, TrendingUp, BellPlus } from "lucide-react-native";

const actions = [
  {
    id: 1,
    icon: <MessageCircleMore size={24} color="#10B981" />,
    title: "Batch Chat",
    subtitle: "Group & DMs",
    bg: "#192723",
    route: "/(tabs)/chat",
  },
  {
    id: 2,
    icon: <TrendingUp size={24} color="#F59E0B" />,
    title: "Rankings",
    subtitle: "Leaderboard",
    bg: "#2C2519",
    route: "/(tabs)/ranking",
  },
  {
    id: 3,
    icon: <BellPlus size={24} color="#6366F1" />,
    title: "Notices",
    subtitle: "Announcements",
    bg: "#20203A",
    route: "/(tabs)/notice",
  },
];

const QuickAccess = ({ showInfo }: { showInfo: () => void }) => {
  const router = useRouter();

  const handlePress = (action: any) => {
    if (action.route) {
      router.push(action.route as any);
    } else {
      showInfo();
    }
  };

  return (
    <View className="px-5 mt-8">
      <Text
        style={{
          letterSpacing: 2,
          color: "#6B7280",
          fontSize: 11,
          marginBottom: 18,
        }}
      >
        QUICK ACCESS
      </Text>

      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          activeOpacity={0.8}
          onPress={() => handlePress(action)}
          style={{
            backgroundColor: "#0F1012",
            borderRadius: 22,
            padding: 18,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: "#1A1B1F",
          }}
        >
          <View className="flex-row items-center">
            <View
              style={{
                backgroundColor: action.bg,
                width: 52,
                height: 52,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {action.icon}
            </View>

            <View className="ml-4 flex-1">
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {action.title}
              </Text>

              <Text
                style={{
                  color: "#6B7280",
                  fontSize: 13,
                  marginTop: 3,
                }}
              >
                {action.subtitle}
              </Text>
            </View>

            <Text
              style={{
                color: "#3F3F46",
                fontSize: 22,
                fontWeight: "300",
              }}
            >
              →
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default QuickAccess;
