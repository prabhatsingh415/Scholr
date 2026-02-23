import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Image,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import AuthForm from "../../components/form/AuthForm";
import { icon } from "../../assets/index";

export default function SignupScreen() {
  const handleRedirect = async () => {
    const url = "https://prabhatsingh-two.vercel.app/";
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open this URL");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
      className="bg-background-primary"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className="mt-8"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className=" flex-1 p-6 justify-center items-center">
            <View className="mb-8 gap-4 flex flex-col justify-center items-center">
              <Image
                source={icon}
                style={{
                  resizeMode: "contain",
                  objectFit: "cover",
                }}
                className="w-36 h-36 rounded-full"
              />
              <Text className="text-lg text-text-primary font-bold italic">
                Welcome to{" "}
                <Text className="font-bold text-brand italic">Scholr</Text> App
              </Text>
            </View>
            <AuthForm
              mode="signup"
              onSubmitData={() => console.log("heyyy ")}
            />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <View className="flex flex-col items-center justify-center gap-2 mb-8">
        <View className="flex flex-row justify-center items-center">
          <View className="h-[1px] w-10 ml-4 bg-border-subtle opacity-50" />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleRedirect}
            className="flex-row items-center mx-4"
          >
            <Text className="text-text-secondary text-[10px] tracking-[2px] uppercase">
              Designed & Crafted by
              <Text className="text-brand font-extrabold tracking-normal">
                {"  "}
                PRABHAT SINGH
              </Text>
            </Text>
          </TouchableOpacity>

          <View className="h-[1px] w-10 bg-border-subtle opacity-50" />
        </View>

        <Text className="text-[9px] text-text-secondary opacity-30 font-mono italic uppercase tracking-tighter">
          build.v0.1.415.226_stable
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
