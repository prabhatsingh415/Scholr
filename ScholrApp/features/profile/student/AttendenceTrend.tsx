import React from "react";
import { View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const AttendanceTrend = () => {
  const screenWidth = Dimensions.get("window").width;

  const barData = [
    { value: 85, label: "Jan", frontColor: "#5A67D8" },
    { value: 92, label: "Feb", frontColor: "#5A67D8" },
    { value: 88, label: "Mar", frontColor: "#4A4A4A" },
    { value: 95, label: "Apr", frontColor: "#5A67D8" },
    { value: 98, label: "May", frontColor: "#5A67D8" },
    { value: 90, label: "Jun", frontColor: "#5A67D8" },
  ];

  return (
    <View className="p-4 rounded-3xl mt-4">
      <Text className="text-white text-lg font-bold mb-4 ml-2">
        Attendance Trend
      </Text>

      <View className="bg-background-box p-4 items-center justify-center rounded-xl">
        <BarChart
          data={barData}
          width={screenWidth - 100}
          height={200}
          barWidth={22}
          spacing={20}
          noOfSections={4}
          barBorderTopLeftRadius={10}
          barBorderTopRightRadius={10}
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{ color: "gray", fontSize: 10 }}
          xAxisLabelTextStyle={{ color: "gray", fontSize: 10 }}
          hideRules // Clean background
          backgroundColor="transparent"
          isAnimated
          animationDuration={1000}
        />
      </View>
    </View>
  );
};

export default AttendanceTrend;
