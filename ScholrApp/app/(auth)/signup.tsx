import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Image,
  Text,
} from "react-native";
import SignupForm from "../../components/form/SignupForm";
import { icon } from "../../assets/index";

export default function SignupScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      className="bg-background-primary"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 p-6 justify-center items-center">
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
            <SignupForm />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
