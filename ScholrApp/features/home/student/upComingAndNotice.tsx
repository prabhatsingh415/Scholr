import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Bell, CalendarClock, ChevronRight } from "lucide-react-native";

const UpcomingAndNotices = () => {
  const upcoming = [
    { id: 1, subject: "Database Systems", time: "Tomorrow, 09:00 AM" },
    { id: 2, subject: "Theory of Computation", time: "28 Feb, 11:30 AM" },
  ];

  const notices = [
    { id: 1, title: "Exam Schedule Out", date: "2 hours ago", urgent: true },
    {
      id: 2,
      title: "Library Timings Changed",
      date: "Yesterday",
      urgent: false,
    },
  ];

  return (
    <View className="px-4 mt-8 pb-10">
      <View className="flex-row justify-between items-end mb-4">
        <Text className="text-text-primary text-2xl font-semibold">
          Upcoming
        </Text>
        <TouchableOpacity>
          <Text className="text-brand font-medium">See All</Text>
        </TouchableOpacity>
      </View>

      {upcoming.map((item) => (
        <View
          key={item.id}
          className="bg-background-secondary p-4 rounded-2xl mb-3 flex-row items-center border border-background-elevated"
        >
          <View className="bg-brand/10 p-3 rounded-xl mr-4">
            <CalendarClock size={24} color="#6366F1" />
          </View>
          <View className="flex-1">
            <Text className="text-text-primary font-bold text-lg">
              {item.subject}
            </Text>
            <Text className="text-text-secondary text-sm">{item.time}</Text>
          </View>
          <ChevronRight size={20} color="#666666" />
        </View>
      ))}

      <Text className="text-text-primary text-2xl font-semibold mt-6 mb-4">
        Notices
      </Text>

      <View className="bg-background-secondary rounded-3xl p-2 border border-background-elevated">
        {notices.map((notice, index) => (
          <TouchableOpacity
            key={notice.id}
            className={`p-4 flex-row items-center ${index !== notices.length - 1 ? "border-b border-background-elevated" : ""}`}
          >
            <View
              className={`h-2 w-2 rounded-full mr-3 ${notice.urgent ? "bg-red-500" : "bg-blue-400"}`}
            />
            <View className="flex-1">
              <Text className="text-text-primary font-medium" numberOfLines={1}>
                {notice.title}
              </Text>
              <Text className="text-text-secondary text-xs">{notice.date}</Text>
            </View>
            <Bell size={16} color="#666666" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default UpcomingAndNotices;
