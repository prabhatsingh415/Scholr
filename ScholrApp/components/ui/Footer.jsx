import { View, Text, TouchableOpacity } from "react-native";
import { handleExternalRedirect } from "../../src/utils/navigation";

const Footer = () => {
  return (
    <View className="flex flex-col items-center justify-center gap-2 mb-8">
      <View className="flex flex-row justify-center items-center">
        <View className="h-[1px] w-10 ml-4 bg-border-subtle opacity-50" />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleExternalRedirect()}
          className="flex-row items-center mx-4"
        >
          <Text className="text-text-secondary text-[10px] tracking-[2px] uppercase">
            Designed & Crafted by{" "}
            <Text className="text-brand font-extrabold tracking-normal">
              {" "}
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
  );
};

export default Footer;
