import { Linking, Alert } from "react-native";

export const handleExternalRedirect = async (
  url: string = "https://prabhatsingh-two.vercel.app/"
) => {
  if (!url || typeof url !== "string") {
    Alert.alert("Invalid Link", "The provided URL is not valid.");
    return;
  }

  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Link Error",
        "Cannot open this link. Please ensure you have a browser installed."
      );
    }
  } catch (err) {
    Alert.alert(
      "Error",
      "An unexpected error occurred while opening the link."
    );
  }
};
