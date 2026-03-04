import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Upload } from "lucide-react-native";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { InfoCard } from "@/components/ui/InfoCard";
import { ProfileDetailsProps } from "@/types/ui";
import Loader from "@/components/ui/Loader";
import ProfileSkeleton from "./ProfileSkeleton";

const ProfileDetails = ({ userData, isError, error }: ProfileDetailsProps) => {
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [hasDismissedError, setHasDismissedError] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);

  const user = userData?.data;

  const isStudent = user?.role === "STUDENT";
  const isTeacher = user?.role === "TEACHER";

  useEffect(() => {
    if (isError) setShowErrorModal(true);
  }, [isError]);

  useEffect(() => {
    let timer: any;
    if (clicked) {
      timer = setTimeout(() => {
        setClicked(false);
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [clicked]);

  if (isError && hasDismissedError) {
    return (
      <View className="bg-background-box p-8 rounded-3xl items-center border border-white/5">
        <Text className="text-gray-500 text-center font-medium">
          Unable to fetch profile info.{"\n"}Please try again later.
        </Text>
      </View>
    );
  }

  if (!user && !isError) {
    return <ProfileSkeleton />;
  }

  return (
    <SafeAreaView className="bg-background-primary flex-1  px-4">
      <ErrorCard
        visible={showErrorModal}
        message={error?.message || "Connection failed"}
        onClose={() => {
          setShowErrorModal(false);
          setHasDismissedError(true);
        }}
      />

      <InfoCard
        visible={clicked}
        message={`This is MVP phase \n We are working on the functionality !`}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="w-full bg-background-box rounded-3xl p-6 shadow-sm">
          {/* Profile Pic & Name */}
          <View className="flex-row items-center gap-6 mb-8">
            <Image
              source={
                user?.profilePicURL
                  ? { uri: user.profilePicURL }
                  : require("@/assets/images/default.png")
              }
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
            <View className="flex-1">
              <Text
                className="text-text-primary font-bold text-2xl"
                numberOfLines={1}
              >
                {user?.firstName} {user?.lastName}
              </Text>
              <View className="bg-brand/10 self-start px-3 py-1 rounded-full mt-1 border border-brand/20">
                <Text className="text-brand text-xs font-bold uppercase tracking-wider">
                  {user?.role}
                </Text>
              </View>
            </View>
          </View>

          {/* Information  */}
          <View className="flex-col gap-6">
            {/* Common Fields: ID & Dept */}
            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="text-gray-500 text-[10px] uppercase tracking-tighter mb-1 font-bold">
                  College ID
                </Text>
                <Text className="text-white text-md font-medium">
                  {user?.collegeId}
                </Text>
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-gray-500 text-[10px] uppercase tracking-tighter mb-1 font-bold">
                  Department
                </Text>
                <Text className="text-white text-md font-medium">
                  {user?.deptId || "General"}
                </Text>
              </View>
            </View>

            {/* Student Only: Roll No & Batch */}
            {isStudent && (
              <View className="flex-row justify-between border-t border-white/5 pt-4">
                <View className="flex-1">
                  <Text className="text-gray-500 text-[10px] uppercase tracking-tighter mb-1 font-bold">
                    Roll Number
                  </Text>
                  <Text className="text-white text-md font-medium">
                    {user?.rollNo || "N/A"}
                  </Text>
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-gray-500 text-[10px] uppercase tracking-tighter mb-1 font-bold">
                    Batch ID
                  </Text>
                  <Text className="text-white text-md font-medium">
                    {user?.batchId || "N/A"}
                  </Text>
                </View>
              </View>
            )}

            {/* Contact Fields */}
            <View className="border-t border-white/5 pt-4">
              <Text className="text-gray-500 text-[10px] uppercase tracking-tighter mb-1 font-bold">
                Email Address
              </Text>
              <Text className="text-white text-md font-medium">
                {user?.email}
              </Text>
            </View>

            <View className="flex flex-row justify-between">
              <View>
                <Text className="text-gray-500 text-[10px] uppercase tracking-tighter mb-1 font-bold">
                  Phone Number
                </Text>
                <Text className="flex-1 text-white text-md font-medium">
                  {user?.phoneNo || "Not Provided"}
                </Text>
              </View>
              {isStudent ? (
                <View>
                  <Text className="flex-1 text-gray-500 text-[10px] uppercase tracking-tighter mb-1 font-bold">
                    Course
                  </Text>
                  <Text className="text-white text-md font-medium">
                    {user?.courseName || "Not Provided"}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Student Only CGPA & Backlogs */}
            {isStudent && (
              <View className="flex-row justify-between bg-white/5 p-4 rounded-2xl mt-2">
                <View>
                  <Text className="text-gray-500 text-[10px] uppercase mb-1 font-bold">
                    CGPA
                  </Text>
                  <Text className="text-brand text-xl font-black">
                    {(user?.cgpa || 0).toFixed(2)}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-gray-500 text-[10px] uppercase mb-1 font-bold">
                    Active Backlogs
                  </Text>
                  <Text
                    className={`text-xl font-black ${user?.activeBacklogs > 0 ? "text-red-500" : "text-white"}`}
                  >
                    {user?.activeBacklogs || 0}
                  </Text>
                </View>
              </View>
            )}

            {/* Action Buttons: Student Only */}
            {isStudent && (
              <TouchableOpacity
                activeOpacity={0.7}
                className="bg-brand p-4 rounded-2xl items-center mt-4 shadow-lg shadow-brand/20"
                onPress={() => setClicked(true)}
              >
                <View className="flex-row items-center gap-3">
                  <Upload size={18} color="black" />
                  <Text className="text-black font-bold text-sm uppercase tracking-widest">
                    Upload Resume
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Message for Teacher */}
            {isTeacher && (
              <View className="bg-brand/5 p-4 rounded-2xl mt-4 border border-brand/10">
                <Text className="text-brand/60 text-xs italic text-center">
                  Teacher account verified. Use the web portal for advanced
                  management.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileDetails;
