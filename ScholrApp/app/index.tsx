import { Text, View, TouchableOpacity, StatusBar } from "react-native";
import "../global.css";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background-primary items-center justify-center">
      <StatusBar hidden={true} />
      <Text className="text-4xl text-cyan-400 font-bold">Scholr Live! 🎓</Text>

      <TouchableOpacity
        className="bg-indigo-500 p-4 rounded-xl items-center mt-4"
        onPress={() => router.push("/signup" as any)}
      >
        <Text className="text-white font-bold text-lg">Go to Signup</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-indigo-500 p-4 rounded-xl items-center mt-4"
        onPress={() => router.push("/verify_otp" as any)}
      >
        <Text className="text-white font-bold text-lg">Verify Otp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-indigo-500 p-4 rounded-xl items-center mt-4"
        onPress={() => router.push("/login" as any)}
      >
        <Text className="text-white font-bold text-lg">login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-indigo-500 p-4 rounded-xl items-center mt-4"
        onPress={() => router.push("/(tabs)/home" as any)}
      >
        <Text className="text-white font-bold text-lg">Home</Text>
      </TouchableOpacity>
    </View>
  );
}
