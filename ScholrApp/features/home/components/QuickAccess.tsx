import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import {
  MessageCircleMore,
  NotebookPen,
  TrendingUp,
  BookOpen,
  QrCode,
  UserCog,
  BellPlus,
} from "lucide-react-native";
import { Role } from "@/types";

const teacherActions = [
  {
    id: 1,
    icon: <QrCode size={36} color={"#10B981"} />,
    title: "Generate QR",
    bg: "#192723",
  },
  {
    id: 2,
    icon: <BellPlus size={36} color={"#F59E0B"} />,
    title: "Post Notice",
    bg: "#2C2519",
  },
  {
    id: 3,
    icon: <NotebookPen size={36} color={"#5355C2"} />,
    title: "Give Assignments",
    bg: "#20202C",
  },
  {
    id: 4,
    icon: <UserCog size={36} color={"#8B5CF6"} />,
    title: "Manage Student",
    bg: "#23202C",
  },
];

const studentActions = [
  {
    id: 1,
    icon: <MessageCircleMore size={36} color={"#10B981"} />,
    title: "Batch Chat",
    bg: "#192723",
  },
  {
    id: 2,
    icon: <TrendingUp size={36} color={"#F59E0B"} />,
    title: "Ranking",
    bg: "#2C2519",
  },
  {
    id: 3,
    icon: <NotebookPen size={36} color={"#5355C2"} />,
    title: "Assignments",
    bg: "#20202C",
  },
  {
    id: 4,
    icon: <BookOpen size={36} color={"#8B5CF6"} />,
    title: "Resources",
    bg: "#23202C",
  },
];

const QuickAccess = ({
  role,
  showInfo,
}: {
  role: Role;
  showInfo: () => void;
}) => {
  const actions = role === "TEACHER" ? teacherActions : studentActions;

  return (
    <View className="px-4 w-full mt-6">
      <Text className="text-text-primary text-2xl font-semibold mb-4">
        Quick Access
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            activeOpacity={0.7}
            className="w-[48%] bg-background-secondary p-6 rounded-3xl mb-4 items-center justify-center border border-background-elevated"
            onPress={showInfo}
          >
            <View
              style={{ backgroundColor: action.bg }}
              className="p-4 rounded-2xl mb-3"
            >
              {action.icon}
            </View>
            <Text className="text-text-primary font-medium text-center">
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default QuickAccess;
