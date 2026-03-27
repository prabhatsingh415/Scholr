import useUserStore from "@/src/store/userStore";
import { Role } from "@/types/user";
import { Tabs } from "expo-router";
import { CircleUserRound, House, ScanQrCode, Users } from "lucide-react-native";
import { Platform } from "react-native";

export default function TabLayout() {
  const user = useUserStore((state) => state.user);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#121212",
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === "android" ? 90 : 70,
          paddingBottom: Platform.OS === "android" ? 25 : 8,
        },
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "#666666",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color }) =>
            user?.role === Role.STUDENT ? (
              <ScanQrCode color={color} />
            ) : (
              <Users color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <CircleUserRound color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
