import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  User,
  Camera,
  Lock,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react-native";

import * as ImagePicker from "expo-image-picker";
import useAuthStore from "@/src/store/authStore";
import useUserStore from "@/src/store/userStore";
import { InfoCard } from "@/components/ui/InfoCard";
import { ErrorCard } from "@/components/ui/ErrorCard";
import { useUpdateName } from "@/src/hooks/user/useUpdateName";
import { useUpdatePassword } from "@/src/hooks/user/useUpdatePassword";
import { useUpdateProfile } from "@/src/hooks/user/useUpdateProfile";
import UpdateNameForm from "@/components/form/UpdateNameForm";
import UpdatePasswordForm from "@/components/form/UpdatePasswordForm";
import { SettingCardProps } from "@/types";
import Loader from "@/components/ui/Loader";
import LogoutModal from "@/components/ui/LogoutModal";

const ProfileSettings = () => {
  const router = useRouter();
  const deleteTokens = useAuthStore((state: any) => state.deleteTokens);
  const deleteUserData = useUserStore((state) => state.deleteData);
  const updateUser = useUserStore((state) => state.updateData);
  const user = useUserStore((state) => state.user);

  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [infoMsg, setInfoMsg] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isEditingPass, setIsEditingPass] = useState<boolean>(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);

  const { mutate: updateName, isPending: isUpdatingName } = useUpdateName();
  const { mutate: updatePass, isPending: isUpdatingPass } = useUpdatePassword();
  const { mutate: updatePic, isPending: isUpdatingPic } = useUpdateProfile();

  useEffect(() => {
    if (showInfo) {
      const timer = setTimeout(() => setShowInfo(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showInfo]);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };
  const confirmLogout = () => {
    setLogoutModalVisible(false);
    deleteTokens();
    deleteUserData();
  };

  const SettingCard = ({ icon: Icon, title, children }: SettingCardProps) => (
    <View className="backdrop:bg-background-box p-8 rounded-[24px] mb-4 border border-white/5">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3">
          <Icon size={20} color="#5A67D8" />
          <Text className="text-white text-lg font-bold">{title}</Text>
        </View>
      </View>
      {children}
    </View>
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      setErrorMessage("Gallery access is required to change photo!");
      setErrorVisible(true);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      const fileToUpload = {
        uri: asset.uri,
        name: asset.fileName || "profile.jpg",
        type: asset.mimeType || "image/jpeg",
      };

      updatePic(
        { file: fileToUpload },
        {
          onSuccess: (response) => {
            if (response.success) {
              updateUser(response.data);
              setInfoMsg("Profile picture updated!");
              setShowInfo(true);
            }
          },
          onError: (err: any) => {
            setErrorMessage(err.message || "Upload failed");
            setErrorVisible(true);
          },
        }
      );
    }
  };

  const handleUpdateName = (formData: any) => {
    updateName(formData, {
      onSuccess: (response) => {
        if (response.success) {
          const data = response.data;
          updateUser(data);

          setIsEditingName(false);
          setInfoMsg("User name updated successfully");
          setShowInfo(true);
        }
      },
      onError: (err: any) => {
        setErrorMessage(err?.response?.data?.message || "Something went wrong");
        setErrorVisible(true);
      },
    });
  };

  const handleUpdatePass = (FormData: any) => {
    updatePass(FormData, {
      onSuccess: (response) => {
        if (response.success) {
          setIsEditingPass(false);
          setInfoMsg("Password changed successfully");
          setShowInfo(true);
        }
      },
      onError: (err: any) => {
        setErrorMessage(err?.response?.data?.message || "Something went wrong");
        setErrorVisible(true);
      },
    });
  };

  return (
    <SafeAreaView className="bg-background-primary flex-1 px-4 ">
      <LogoutModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={confirmLogout}
      />
      {isUpdatingName && (
        <View className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <View className="bg-background-box p-6 rounded-3xl border border-white/10 items-center">
            <ActivityIndicator size="large" color="#5A67D8" />
            <Text className="text-white mt-4 font-medium">
              Updating Name...
            </Text>
          </View>
        </View>
      )}

      {(isUpdatingPass || isUpdatingPic) && (
        <Loader
          children={
            isUpdatingPass ? "Updating Password..." : "Updating Profile Pic..."
          }
        />
      )}

      <InfoCard visible={showInfo} message={infoMsg} />

      <ErrorCard
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />

      <View className="flex-row items-center justify-between mb-6 pt-2">
        <TouchableOpacity
          onPress={() => router.replace("/profile")}
          className="flex-row items-center"
        >
          <ChevronLeft color="gray" size={24} />
          <Text className="text-gray-400 text-lg ml-1">Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="mt-8">
        {/* Edit Name Section */}
        <SettingCard icon={User} title="Edit Name">
          <View className="flex-row justify-between">
            {isEditingName ? (
              <UpdateNameForm
                firstName={user?.firstName}
                lastName={user?.lastName}
                onSubmitData={handleUpdateName}
                onCancel={() => setIsEditingName(false)}
              />
            ) : (
              <>
                <Text className="text-white text-xl font-medium mb-1">
                  {user?.firstName} {user?.lastName}
                </Text>
                <TouchableOpacity onPress={() => setIsEditingName(true)}>
                  <Text className="text-brand font-bold uppercase tracking-widest text-xs mt-1">
                    Edit
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </SettingCard>

        {/* Profile Picture Section */}
        <SettingCard icon={Camera} title="Profile Picture">
          <View className="flex-row items-center gap-6">
            <View className="bg-[#5A67D8] w-24 h-24 rounded-full items-center justify-center overflow-hidden">
              {user?.profilePicURL ? (
                <Image
                  source={{ uri: user.profilePicURL }}
                  className="w-full h-full"
                />
              ) : null}
            </View>
            <TouchableOpacity
              onPress={() => pickImage()}
              className="bg-[#5A67D8] px-5 py-2.5 rounded-xl"
            >
              <Text className="text-white font-bold text-xs">Change Photo</Text>
            </TouchableOpacity>
          </View>
        </SettingCard>

        {/* Reset Password Section */}
        <SettingCard icon={Lock} title="Reset Password">
          {isEditingPass ? (
            <UpdatePasswordForm
              onSubmitData={handleUpdatePass}
              onCancel={() => setIsEditingPass(false)}
            />
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setIsEditingPass(true)}
                className="mb-4"
              >
                <Text className="text-brand font-bold text-md">
                  Change Password
                </Text>
              </TouchableOpacity>

              <View className="bg-[#0D0D0D] p-4 rounded-xl border border-white/5">
                <Text className="text-gray-400 text-[11px] leading-4">
                  <Text className="text-brand font-bold">Note:</Text> If you
                  forgot your password, please contact the administrator to
                  reset it.
                </Text>
              </View>
            </>
          )}
        </SettingCard>

        {/* Logout Section*/}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
          className="bg-background-box p-5 rounded-[24px] border border-white/5 flex-row items-center justify-between mt-4"
        >
          <View className="flex-row items-center gap-3">
            <LogOut size={20} color="#EF4444" />
            <Text className="text-[#EF4444] text-lg font-bold">Logout</Text>
          </View>
          <ChevronRight size={20} color="#EF4444" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSettings;
